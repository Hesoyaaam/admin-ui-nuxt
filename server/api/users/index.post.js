import db from "../../utils/db";
import bcrypt from "bcrypt";
import { userSchema } from "../../utils/schemas";
import { catatLog } from "../../utils/logger";
import { getAuthUserId } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const currentUserId = getAuthUserId(event);

  const rawBody = await readBody(event);

  const parsedData = userSchema.safeParse(rawBody);
  if (!parsedData.success) {
    const errorMessages = parsedData.error.issues
      .map((i) => i.message)
      .join(", ");
    throw createError({
      statusCode: 400,
      statusMessage: errorMessages,
    });
  }

  const body = parsedData.data;
  const conn = await db.getConnection();

  try {
    const existing = await conn.query(
      "SELECT id FROM user WHERE username = ?",
      [body.username],
    );
    if (existing.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Username sudah digunakan",
      });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    await conn.query(
      `INSERT INTO user (username, password_hash, nama, id_pegawai, id_role) 
   VALUES (?, ?, ?, ?, ?)`,
      [body.username, hashedPassword, body.nama, body.id_pegawai, body.id_role],
    );

    if (body.id_pegawai) {
      const statusPegawai = body.is_aktif ? "Aktif" : "Nonaktif";
      await conn.query("UPDATE pegawai SET status = ? WHERE id = ?", [
        statusPegawai,
        body.id_pegawai,
      ]);
    }

    await catatLog(
      event,
      "Manajemen User",
      `CREATE: Menambahkan data user ID: ${id}`,
      currentUserId,
    );

    return { status: "success", message: "User berhasil ditambahkan" };
  } finally {
    conn.release();
  }
});
