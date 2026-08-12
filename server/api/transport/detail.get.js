import db from "../../utils/db";
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const conn = await db.getConnection();

  const bulan = Number(query.bulan);
  const tahun = Number(query.tahun);

  try {
    const sql = `
      SELECT 
        t.id, 
        t.id_pegawai, 
        p.nama_pegawai, 
        t.total_km, 
        t.jumlah_hari, 
        t.nominal_tunjangan
      FROM tunjangan_transport t
      JOIN pegawai p ON t.id_pegawai = p.id
      WHERE t.bulan = ? AND t.tahun = ?
      ORDER BY p.nama_pegawai ASC
    `;

    const data = await conn.query(sql, [bulan, tahun]);

    const serializedData = data.map((row) => ({
      ...row,
      total_km: Number(row.total_km),
      jumlah_hari: Number(row.jumlah_hari || 0),
      nominal_tunjangan: Number(row.nominal_tunjangan),
    }));

    return {
      status: "success",
      data: serializedData,
    };
  } catch (error) {
    console.error("ERROR GET DETAIL TRANSPORT:", error.message);
    throw createError({ statusCode: 500, message: error.message });
  } finally {
    conn.release();
  }
});
