import db from "../../utils/db";
import { pegawaiSchema } from "../../utils/schemas";
import { catatLog } from "../../utils/logger";
import { getAuthUserId } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const currentUserId = getAuthUserId(event);

  const rawBody = await readBody(event);
  const conn = await db.getConnection();

  const parsedData = pegawaiSchema.safeParse(rawBody);
  if (!parsedData.success) {
    const errorMessages = parsedData.error.issues
      .map((i) => i.message)
      .join(", ");
    throw createError({ statusCode: 400, message: errorMessages });
  }

  const body = parsedData.data;

  try {
    await conn.beginTransaction();

    const result = await conn.query(
      `
      INSERT INTO pegawai 
      (nip, nama_pegawai, email, nomor_hp, tempat_lahir, tanggal_lahir, id_kecamatan, alamat_lengkap, status_kawin, jumlah_anak, tanggal_masuk, id_jabatan, id_departemen, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        body.nip,
        body.nama_pegawai,
        body.email,
        body.nomor_hp,
        body.tempat_lahir,
        body.tanggal_lahir,
        body.id_kecamatan,
        body.alamat_lengkap,
        body.status_kawin,
        body.jumlah_anak,
        body.tanggal_masuk,
        body.id_jabatan,
        body.id_departemen,
        body.status,
      ],
    );

    const rawId = result.insertId ? result.insertId : result[0]?.insertId;
    const idPegawaiBaru = Number(rawId);

    if (body.riwayat_pendidikan && body.riwayat_pendidikan.length > 0) {
      for (const edu of body.riwayat_pendidikan) {
        await conn.query(
          `
           INSERT INTO pegawai_pendidikan (id_pegawai, tingkat_pendidikan, nama_sekolah, tahun_lulus)
           VALUES (?, ?, ?, ?)
          `,
          [idPegawaiBaru, edu.tingkat, edu.nama_sekolah, edu.tahun_lulus],
        );
      }
    }

    await conn.commit();

    await catatLog(
      event,
      "Manajemen Pegawai",
      `CREATE: Create data pegawai ID: ${idPegawaiBaru}`,
      currentUserId,
    );

    return {
      status: "success",
      message: "Data pegawai berhasil ditambahkan",
      data: { id: idPegawaiBaru },
    };
  } catch (error) {
    await conn.rollback();

    if (error.code === "ER_DUP_ENTRY") {
      throw createError({
        statusCode: 409,
        message: "NIP atau Email sudah terdaftar pada pegawai lain",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "DB_ERROR",
      message: error.message,
    });
  } finally {
    conn.release();
  }
});
