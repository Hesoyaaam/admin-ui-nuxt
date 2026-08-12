import db from "../utils/db";
import { getAuthUserId } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const currentUserId = getAuthUserId(event);

  if (!currentUserId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Sesi tidak ditemukan atau telah kedaluwarsa",
    });
  }

  const conn = await db.getConnection();

  try {
    const queryStr = `
      SELECT 
        u.id as user_id, 
        u.username, 
        u.email as user_email, 
        p.id as id_pegawai,
        p.nip, 
        p.nama_pegawai, 
        p.email, 
        p.nomor_hp, 
        p.tempat_lahir, 
        p.tanggal_lahir, 
        p.id_kecamatan, 
        p.alamat_lengkap, 
        p.status_kawin, 
        p.jumlah_anak, 
        p.tanggal_masuk, 
        p.status
      FROM user u 
      LEFT JOIN pegawai p ON u.id_pegawai = p.id 
      WHERE u.id = ? 
      LIMIT 1
    `;

    const userRows = await conn.query(queryStr, [currentUserId]);
    const users =
      Array.isArray(userRows) && Array.isArray(userRows[0])
        ? userRows[0]
        : userRows;

    if (!users || users.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Data profil tidak ditemukan",
      });
    }

    const pegawai = users[0];

    let riwayatPendidikan = [];
    if (pegawai.id_pegawai) {
      const eduQuery = `
        SELECT tingkat_pendidikan as tingkat, nama_sekolah, tahun_lulus 
        FROM pegawai_pendidikan 
        WHERE id_pegawai = ?
      `;
      const eduRows = await conn.query(eduQuery, [pegawai.id_pegawai]);
      riwayatPendidikan =
        Array.isArray(eduRows) && Array.isArray(eduRows[0])
          ? eduRows[0]
          : eduRows;
    }

    return {
      status: "success",
      data: {
        nip: pegawai.nip || "",
        nama_pegawai: pegawai.nama_pegawai || pegawai.username || "",
        email: pegawai.email || pegawai.user_email || "",
        nomor_hp: pegawai.nomor_hp || "",
        tempat_lahir: pegawai.tempat_lahir || "",
        tanggal_lahir: pegawai.tanggal_lahir || "",
        alamat_lengkap: pegawai.alamat_lengkap || "",
        id_kecamatan: pegawai.id_kecamatan || "",
        status_kawin: pegawai.status_kawin || "Belum Menikah",
        jumlah_anak: pegawai.jumlah_anak || 0,
        tanggal_masuk: pegawai.tanggal_masuk || "",
        nama_jabatan: pegawai.nama_jabatan || "-",
        nama_departemen: pegawai.nama_departemen || "-",
        status: pegawai.status || "Aktif",
        foto: null,
        riwayat_pendidikan: riwayatPendidikan || [],
      },
    };
  } catch (error) {
    console.error("ERROR GET PROFILE:", error.message);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || "Terjadi kesalahan saat memuat profil",
      message: error.message,
    });
  } finally {
    conn.release();
  }
});
