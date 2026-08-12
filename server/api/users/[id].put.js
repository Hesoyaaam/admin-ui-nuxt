import db from "../../utils/db";
import bcrypt from "bcrypt";
import { userSchema } from "../../utils/schemas";
import { catatLog } from "../../utils/logger";
import { getAuthUserId } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
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
    const existingResult = await conn.query(
      "SELECT id FROM user WHERE id = ?",
      [id],
    );
    const existingUser =
      Array.isArray(existingResult) && Array.isArray(existingResult[0])
        ? existingResult[0]
        : existingResult;

    if (!existingUser || existingUser.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "User tidak ditemukan",
      });
    }

    const usernameCheckResult = await conn.query(
      "SELECT id FROM user WHERE username = ? AND id != ?",
      [body.username, id],
    );
    const usernameCheck =
      Array.isArray(usernameCheckResult) &&
      Array.isArray(usernameCheckResult[0])
        ? usernameCheckResult[0]
        : usernameCheckResult;

    if (usernameCheck && usernameCheck.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Username sudah digunakan oleh user lain",
      });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    await conn.query(
      `UPDATE user SET username = ?, password_hash = ?, nama = ?, id_pegawai = ?, id_role = ? WHERE id = ?`,
      [
        body.username,
        hashedPassword,
        body.nama,
        body.id_pegawai,
        body.id_role,
        id,
      ],
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
      `UPDATE: Mengubah data user ID ${id}`,
      body.admin_id,
    );

    return {
      status: "success",
      message: "User berhasil diperbarui",
    };
  } finally {
    conn.release();
  }
});
