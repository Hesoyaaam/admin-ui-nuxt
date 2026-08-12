import db from "../../utils/db";
import { catatLog } from "../../utils/logger";
import { getAuthUserId } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const currentUserId = getAuthUserId(event);
  const body = await readBody(event);
  const conn = await db.getConnection();

  try {
    if (!body.nama_pegawai || !body.email) {
      throw createError({
        statusCode: 400,
        statusMessage: "Nama dan Email wajib diisi",
      });
    }

    await conn.beginTransaction();

    await conn.query(
      `
      UPDATE pegawai SET 
        nip = ?, nama_pegawai = ?, email = ?, nomor_hp = ?, 
        tempat_lahir = ?, tanggal_lahir = ?, id_kecamatan = ?, 
        alamat_lengkap = ?, status_kawin = ?, jumlah_anak = ?, 
        tanggal_masuk = ?, id_jabatan = ?, id_departemen = ?, status = ?
      WHERE id = ?
    `,
      [
        body.nip,
        body.nama_pegawai,
        body.email,
        body.nomor_hp,
        body.tempat_lahir,
        body.tanggal_lahir || null,
        body.id_kecamatan || null,
        body.alamat_lengkap,
        body.status_kawin,
        body.jumlah_anak,
        body.tanggal_masuk || null,
        body.id_jabatan || null,
        body.id_departemen || null,
        body.status,
        id,
      ],
    );

    await conn.query(`DELETE FROM pegawai_pendidikan WHERE id_pegawai = ?`, [
      id,
    ]);

    if (body.riwayat_pendidikan && body.riwayat_pendidikan.length > 0) {
      for (const edu of body.riwayat_pendidikan) {
        if (edu.tingkat && edu.nama_sekolah) {
          await conn.query(
            `
             INSERT INTO pegawai_pendidikan (id_pegawai, tingkat_pendidikan, nama_sekolah, tahun_lulus)
             VALUES (?, ?, ?, ?)
           `,
            [id, edu.tingkat, edu.nama_sekolah, edu.tahun_lulus],
          );
        }
      }
    }

    await conn.commit();

    await catatLog(
      event,
      "Manajemen Pegawai",
      `UPDATE: Update data pegawai}`,
      currentUserId,
    );

    return {
      status: "success",
      message: "Data pegawai berhasil diperbarui",
    };
  } catch (error) {
    await conn.rollback();
    console.error("ERROR UPDATE PEGAWAI:", error.message);

    if (error.code === "ER_DUP_ENTRY") {
      throw createError({
        statusCode: 409,
        statusMessage: "NIP atau Email sudah terdaftar pada pegawai lain",
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || "Terjadi kesalahan saat memperbarui data",
      message: error.message,
    });
  } finally {
    conn.release();
  }
});
