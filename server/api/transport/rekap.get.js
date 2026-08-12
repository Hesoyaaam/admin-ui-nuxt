import db from "../../utils/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const conn = await db.getConnection();

  const tahun = query.tahun ? Number(query.tahun) : new Date().getFullYear();

  try {
    const sql = `
      SELECT 
        bulan,
        COUNT(DISTINCT id_pegawai) as total_penerima,
        SUM(nominal_tunjangan) as total_tunjangan
      FROM tunjangan_transport
      WHERE tahun = ?
      GROUP BY bulan
      ORDER BY bulan DESC
    `;

    const data = await conn.query(sql, [tahun]);

    const serializedData = data.map((row) => ({
      ...row,
      total_penerima: Number(row.total_penerima),
      total_tunjangan: Number(row.total_tunjangan),
    }));

    return {
      status: "success",
      tahun: tahun,
      data: serializedData,
    };
  } catch (error) {
    console.error("ERROR REKAP TRANSPORT:", error.message);
    throw createError({ statusCode: 500, message: error.message });
  } finally {
    conn.release();
  }
});
