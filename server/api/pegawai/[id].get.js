import db from "../../utils/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  const conn = await db.getConnection();
  try {
    const [pegawai] = await conn.query(
      `
      SELECT 
        p.*,
        j.nama as nama_jabatan,
        d.nama as nama_departemen,
        TIMESTAMPDIFF(YEAR, p.tanggal_lahir, CURDATE()) as hitung_usia,
        TIMESTAMPDIFF(YEAR, p.tanggal_masuk, CURDATE()) as masa_kerja
      FROM pegawai p
      LEFT JOIN master_data j ON p.id_jabatan = j.id
      LEFT JOIN master_data d ON p.id_departemen = d.id
      WHERE p.id = ? OR p.nip = ?
      LIMIT 1
    `,
      [id, id],
    );

    if (!pegawai) {
      throw createError({
        statusCode: 404,
        statusMessage: "Data pegawai tidak ditemukan",
      });
    }

    for (const key in pegawai) {
      if (typeof pegawai[key] === "bigint") {
        pegawai[key] = Number(pegawai[key]);
      }
    }

    let pendidikan = [];
    try {
      pendidikan = await conn.query(
        `
        SELECT id, tingkat, nama_sekolah, tahun_lulus 
        FROM pegawai_pendidikan 
        WHERE id_pegawai = ?
        ORDER BY tahun_lulus DESC
      `,
        [pegawai.id],
      );
    } catch (e) {
      pendidikan = [];
    }

    const detailData = {
      ...pegawai,
      usia: pegawai.hitung_usia,
      riwayat_pendidikan: pendidikan,
    };

    return {
      status: "success",
      data: detailData,
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Terjadi kesalahan server",
    });
  } finally {
    conn.release();
  }
});
