import db from "../../utils/db";
import { catatLog } from "../../utils/logger";
import { getAuthUserId } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  const currentUserId = getAuthUserId(event);
  const conn = await db.getConnection();

  try {
    const result = await conn.query(
      "SELECT id_pegawai FROM user WHERE id = ?",
      [id],
    );
    const rows =
      Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;

    if (!rows || rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "User tidak ditemukan",
      });
    }

    const userIdPegawai = rows[0].id_pegawai;

    await conn.query("DELETE FROM user WHERE id = ?", [id]);

    if (userIdPegawai) {
      await conn.query("UPDATE pegawai SET status = 'Aktif' WHERE id = ?", [
        userIdPegawai,
      ]);
    }

    await catatLog(
      event,
      "Manajemen User",
      `DELETE: Menghapus data user ID: ${id}`,
      currentUserId,
    );

    return {
      status: "success",
      message: "User berhasil dihapus",
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || error.message || "Gagal menghapus user",
    });
  } finally {
    conn.release();
  }
});
