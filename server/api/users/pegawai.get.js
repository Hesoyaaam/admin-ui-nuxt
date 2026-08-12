import db from "../../utils/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const search = query.search || "";

  if (!search || search.length < 2) {
    return { status: "success", data: [] };
  }

  const conn = await db.getConnection();

  try {
    const [rows] = await conn.query(
      "SELECT id, nama_pegawai AS nama FROM pegawai WHERE nama_pegawai LIKE ? LIMIT 10",
      [`%${search}%`],
    );

    return {
      status: "success",
      data: rows,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal mengambil data pegawai",
    });
  } finally {
    conn.release();
  }
});
