import db from "../../utils/db";

export default defineEventHandler(async (event) => {
  const conn = await db.getConnection();
  try {
    const users = await conn.query(`
      SELECT 
        u.id, 
        u.username, 
        u.nama as nama_user,
        p.nama_pegawai, 
        r.nama_role as role,
        p.status,
        j_jabatan.nama as jabatan,
        j_dept.nama as departemen
      FROM user u
      LEFT JOIN pegawai p ON u.id_pegawai = p.id
      LEFT JOIN user_role r ON u.id_role = r.id
      LEFT JOIN master_data j_jabatan ON p.id_jabatan = j_jabatan.id AND j_jabatan.tipe = 'jabatan'
      LEFT JOIN master_data j_dept ON p.id_departemen = j_dept.id AND j_dept.tipe = 'departemen'
      ORDER BY u.id DESC
    `);

    const rows =
      Array.isArray(users) && Array.isArray(users[0]) ? users[0] : users;

    return {
      status: "success",
      data: rows.map((user, index) => ({
        no: index + 1,
        id: user.id,
        nama: user.nama_pegawai || user.nama_user || "-",
        username: user.username,
        jabatan: user.jabatan || "-",
        departemen: user.departemen || "-",
        role: user.role || "-",
        status: user.status === "Nonaktif" ? "Nonaktif" : "Aktif",
      })),
    };
  } finally {
    conn.release();
  }
});
