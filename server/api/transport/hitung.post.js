import db from "../../utils/db";
import { catatLog } from "../../utils/logger";
import { getAuthUserId } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const currentUserId = getAuthUserId(event);

  const body = await readBody(event);
  const { bulan, tahun } = body;
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const setting = await conn.query(
      `SELECT tarif_per_km FROM setting_transport ORDER BY berlaku_mulai DESC LIMIT 1`,
    );
    if (!setting || setting.length === 0) {
      throw createError({
        statusCode: 400,
        message: "Setting tarif transport belum diatur!",
      });
    }
    const baseFare = Number(setting[0].tarif_per_km);

    const pegawaiList = await conn.query(
      `SELECT id, nama_pegawai, jarak_rumah_kantor FROM pegawai WHERE status = 'Aktif'`,
    );

    await conn.query(
      `DELETE FROM tunjangan_transport WHERE bulan = ? AND tahun = ?`,
      [bulan, tahun],
    );

    for (const pegawai of pegawaiList) {
      const hariMasuk = Math.floor(Math.random() * (26 - 15 + 1)) + 15;
      const isPegawaiTetap = true;

      let rawKm = pegawai.jarak_rumah_kantor
        ? Number(pegawai.jarak_rumah_kantor)
        : 0;
      let km = Math.round(rawKm);
      let nominalTunjangan = 0;

      if (isPegawaiTetap && hariMasuk >= 19 && km > 5) {
        let kmDihitung = km > 25 ? 25 : km;
        nominalTunjangan = baseFare * kmDihitung * hariMasuk;
      }

      await conn.query(
        `
        INSERT INTO tunjangan_transport (id_pegawai, bulan, tahun, total_km, jumlah_hari, nominal_tunjangan) 
        VALUES (?, ?, ?, ?, ?, ?)
      `,
        [pegawai.id, bulan, tahun, km, hariMasuk, nominalTunjangan],
      );
    }

    await conn.commit();

    await catatLog(
      event,
      "Manajemen Transport",
      `CREATE: Menhitung`,
      currentUserId,
    );

    return { status: "success", message: "Perhitungan selesai!" };
  } catch (error) {
    await conn.rollback();
    console.error(error);
    throw createError({ statusCode: 500, message: error.message });
  } finally {
    conn.release();
  }
});
