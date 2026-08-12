import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../utils/db";
import { loginSchema } from "../../utils/schemas";
import { catatLog } from "../../utils/logger";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const {
    captcha_input = "",
    captcha_id = "",
    remember_me = false,
  } = body || {};

  const parsedData = loginSchema.safeParse(body);
  if (!parsedData.success || !captcha_input || !captcha_id) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Harap isi semua field yang diwajibkan dengan format yang benar",
    });
  }

  const { identifier, password } = parsedData.data;

  const storage = useStorage();
  const storedCaptcha = await storage.getItem(`cache:captcha:${captcha_id}`);

  if (
    !storedCaptcha ||
    String(storedCaptcha).toLowerCase() !== String(captcha_input).toLowerCase()
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Captcha salah atau kadaluarsa",
    });
  }
  await storage.removeItem(`cache:captcha:${captcha_id}`);

  const conn = await db.getConnection();
  let user = null;

  try {
    const queryStr = `
      SELECT u.*, p.nama_pegawai, p.status as status_pegawai, r.nama_role as role_name 
      FROM user u 
      LEFT JOIN pegawai p ON u.id_pegawai = p.id 
      LEFT JOIN user_role r ON u.id_role = r.id
      WHERE u.username = ? OR u.email = ? OR p.email = ? OR p.nomor_hp = ? LIMIT 1
    `;
    const rows = await conn.query(queryStr, [
      identifier,
      identifier,
      identifier,
      identifier,
    ]);

    if (rows && rows.length > 0) {
      user = rows[0];
    }
  } finally {
    conn.release();
  }

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Username atau password salah",
    });
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password_hash || "",
  );
  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      statusMessage: "Username atau password salah",
    });
  }

  if (user.disabled || user.status_pegawai === "Nonaktif") {
    throw createError({ statusCode: 403, statusMessage: "Akun dinonaktifkan" });
  }

  const config = useRuntimeConfig();
  const secret =
    process.env.JWT_SECRET || config.jwtSecret || "super_secret_key_jmc_2026";

  const expiresIn = remember_me ? "30d" : "3m";

  const token = jwt.sign({ id: user.id, role: user.role_name }, secret, {
    expiresIn,
  });

  setCookie(event, "auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: remember_me ? 30 * 24 * 60 * 60 : 3 * 60,
    path: "/",
  });

  await catatLog(event, "Autentikasi", `LOGIN: User ${user.username}`, user.id);

  return {
    status: "success",
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role_name,
    },
  };
});
