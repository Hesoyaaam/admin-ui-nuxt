import jwt from "jsonwebtoken";
import db from "../utils/db";

export default defineEventHandler(async (event) => {
  let token = null;

  token = getCookie(event, "auth_token");

  if (!token) {
    const authHeader = getHeader(event, "authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Sesi tidak ditemukan, silakan login kembali",
    });
  }

  try {
    const config = useRuntimeConfig();
    const secret =
      process.env.JWT_SECRET || config.jwtSecret || "super_secret_key_jmc_2026";

    const decoded = jwt.verify(token, secret);

    const conn = await db.getConnection();
    let user = null;

    try {
      const queryStr = `
        SELECT u.id, u.username, u.email, u.nama as nama_user, p.nama_pegawai, r.nama_role as role_name 
        FROM user u 
        LEFT JOIN pegawai p ON u.id_pegawai = p.id 
        LEFT JOIN user_role r ON u.id_role = r.id
        WHERE u.id = ? LIMIT 1
      `;
      const rows = await conn.query(queryStr, [decoded.id]);

      if (rows && rows.length > 0) {
        user = rows[0];
      }
    } finally {
      conn.release();
    }

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "Pengguna tidak ditemukan di database",
      });
    }

    return {
      status: "success",
      user: {
        id: user.id,
        username: user.username,
        nama: user.nama_pegawai || user.nama_user || user.username,
        email: user.email,
        role: user.role_name,
        foto: null,
      },
    };
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: "Sesi telah berakhir atau tidak valid",
    });
  }
});
