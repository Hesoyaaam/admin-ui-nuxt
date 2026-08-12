import db from "../../utils/db";
import { catatLog } from "../../utils/logger";
import { getAuthUserId } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const currentUserId = getAuthUserId(event);
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query(`DELETE FROM pegawai_pendidikan WHERE id_pegawai = ?`, [
      id,
    ]);

    const result = await conn.query(`DELETE FROM pegawai WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Data pegawai tidak ditemukan",
      });
    }

    await conn.commit();

    await catatLog(
      event,
      "Manajemen Pegawai",
      `DELETE: Menghapus data pegawai ID: ${id}`,
      currentUserId,
    );

    return {
      status: "success",
      message: "Data pegawai berhasil dihapus",
    };
  } catch (error) {
    await conn.rollback();
    console.error("ERROR HAPUS:", error.message);
    throw createError({
      statusCode: 500,
      statusMessage: "Terjadi kesalahan saat menghapus data",
      message: error.message,
    });
  } finally {
    conn.release();
  }
});
