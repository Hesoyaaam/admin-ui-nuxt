import db from "../../utils/db";

export default defineEventHandler(async (event) => {
  const conn = await db.getConnection();
  try {
    const totalPegawaiRes = await conn.query(
      "SELECT COUNT(*) as total FROM pegawai",
    );
    const kontrakRes = await conn.query(
      "SELECT COUNT(*) as total FROM pegawai WHERE jenis_kontrak = 'PKWT'",
    );
    const tetapRes = await conn.query(
      "SELECT COUNT(*) as total FROM pegawai WHERE jenis_kontrak = 'PKWTT'",
    );
    const magangRes = await conn.query(
      "SELECT COUNT(*) as total FROM pegawai WHERE jenis_kontrak = 'Magang'",
    );

    const genderRes = await conn.query(`
      SELECT jenis_kelamin, COUNT(*) as total 
      FROM pegawai 
      GROUP BY jenis_kelamin
    `);

    const latestPegawai = await conn.query(`
      SELECT id, nama_pegawai, tanggal_masuk, jenis_kontrak 
      FROM pegawai 
      ORDER BY tanggal_masuk DESC 
      LIMIT 5
    `);

    const formattedGender = genderRes.map((g) => ({
      jenis_kelamin: g.jenis_kelamin,
      total: Number(g.total),
    }));

    return {
      status: "success",
      data: {
        widgets: {
          totalPegawai: Number(totalPegawaiRes[0].total),
          totalKontrak: Number(kontrakRes[0].total),
          totalTetap: Number(tetapRes[0].total),
          totalMagang: Number(magangRes[0].total),
        },
        charts: {
          kontrakVsTetapVsMagang: {
            kontrak: Number(kontrakRes[0].total),
            tetap: Number(tetapRes[0].total),
            magang: Number(magangRes[0].total),
          },
          gender: formattedGender,
        },
        latestPegawai: latestPegawai,
      },
    };
  } catch (error) {
    console.error("ERROR DASHBOARD MANAGER:", error.message);
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  } finally {
    conn.release();
  }
});
