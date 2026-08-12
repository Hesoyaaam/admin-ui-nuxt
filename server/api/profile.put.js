import db from "../utils/db";
import { getAuthUserId } from "../utils/auth";
import { catatLog } from "../utils/logger";

export default defineEventHandler(async (event) => {
  const currentUserId = getAuthUserId(event);
  if (!currentUserId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Sesi tidak ditemukan atau telah kedaluwarsa",
    });
  }

  const body = await readBody(event);
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const userRows = await conn.query(
      "SELECT id_pegawai FROM user WHERE id = ?",
      [currentUserId],
    );
    const users =
      Array.isArray(userRows) && Array.isArray(userRows[0])
        ? userRows[0]
        : userRows;

    if (!users || users.length === 0 || !users[0].id_pegawai) {
      throw createError({
        statusCode: 404,
        statusMessage: "Data pegawai tidak terikat dengan akun ini",
      });
    }

    const idPegawai = users[0].id_pegawai;

    let dbStatusKawin = "belum";
    const statusInput = String(body.status_kawin || "").toLowerCase();
    if (statusInput.includes("menikah") || statusInput.includes("kawin")) {
      dbStatusKawin = "kawin";
    } else {
      dbStatusKawin = "belum";
    }

    await conn.query(
      `UPDATE pegawai SET 
        nip = ?, nama_pegawai = ?, email = ?, nomor_hp = ?, 
        tempat_lahir = ?, tanggal_lahir = ?, id_kecamatan = ?, 
        alamat_lengkap = ?, status_kawin = ?, jumlah_anak = ?
      WHERE id = ?`,
      [
        body.nip,
        body.nama_pegawai,
        body.email,
        body.nomor_hp,
        body.tempat_lahir,
        body.tanggal_lahir || null,
        body.id_kecamatan || null,
        body.alamat_lengkap,
        dbStatusKawin,
        body.jumlah_anak || 0,
        idPegawai,
      ],
    );

    await conn.query(`DELETE FROM pegawai_pendidikan WHERE id_pegawai = ?`, [
      idPegawai,
    ]);

    if (body.riwayat_pendidikan && body.riwayat_pendidikan.length > 0) {
      for (const edu of body.riwayat_pendidikan) {
        if (edu.tingkat && edu.nama_sekolah) {
          await conn.query(
            `INSERT INTO pegawai_pendidikan (id_pegawai, tingkat_pendidikan, nama_sekolah, tahun_lulus) VALUES (?, ?, ?, ?)`,
            [idPegawai, edu.tingkat, edu.nama_sekolah, edu.tahun_lulus],
          );
        }
      }
    }

    await conn.commit();

    await catatLog(
      event,
      "My Profile",
      `UPDATE: Memperbarui data profil mandiri oleh User ID ${currentUserId}`,
      currentUserId,
    );

    return {
      status: "success",
      message: "Profil berhasil diperbarui",
    };
  } catch (error) {
    await conn.rollback();
    console.error("ERROR UPDATE PROFILE:", error.message);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || "Terjadi kesalahan saat menyimpan profil",
      message: error.message,
    });
  } finally {
    conn.release();
  }
});
