import db from "../../utils/db";

export default defineEventHandler(async (event) => {
  const conn = await db.getConnection();
  try {
    const rows = await conn.query(`
      SELECT id, nama_role as role, created_at 
      FROM user_role 
      ORDER BY id ASC
    `);

    return {
      status: "success",
      data: rows.map((row, index) => ({
        no: index + 1,
        id: row.id,
        role: row.role,
        deskripsi: `Hak akses untuk role ${row.role}`,
      })),
    };
  } finally {
    conn.release();
  }
});
