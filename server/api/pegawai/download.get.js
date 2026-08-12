import db from "../../utils/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const conn = await db.getConnection();

  try {
    const data = await conn.query(
      `SELECT nip, nama_pegawai, email, nomor_hp FROM pegawai`,
    );

    const header = "NIP,Nama,Email,Nomor HP\n";
    const rows = data
      .map((p) => `${p.nip},${p.nama_pegawai},${p.email},${p.nomor_hp}`)
      .join("\n");
    const csvContent = header + rows;

    setHeader(event, "Content-Type", "text/csv");
    setHeader(
      event,
      "Content-Disposition",
      "attachment; filename=data-pegawai.csv",
    );

    return csvContent;
  } finally {
    conn.release();
  }
});
