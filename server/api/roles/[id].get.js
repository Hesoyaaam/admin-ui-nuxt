import db from "../../utils/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const conn = await db.getConnection();

  try {
    const roleRows = await conn.query(
      "SELECT id, nama_role as role FROM user_role WHERE id = ? LIMIT 1",
      [id],
    );
    if (!roleRows || roleRows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Role tidak ditemukan",
      });
    }
    const role = roleRows[0];
    const roleName = role.role;

    const permissions = [
      {
        modul: "Dashboard",
        akses: true,
        create: false,
        read: "All",
        update: "No",
        delete: "No",
      },
      {
        modul: "My Profile",
        akses: true,
        create: false,
        read: "Own",
        update: "Own",
        delete: "No",
      },
      {
        modul: "Kelola Role",
        akses: roleName === "Superadmin",
        create: false,
        read: roleName === "Superadmin" ? "All" : "No",
        update: "No",
        delete: "No",
      },
      {
        modul: "Manajemen User",
        akses: roleName === "Superadmin",
        create: roleName === "Superadmin",
        read: roleName === "Superadmin" ? "All" : "No",
        update: roleName === "Superadmin" ? "All" : "No",
        delete: roleName === "Superadmin" ? "All" : "No",
      },
      {
        modul: "Data Pegawai",
        akses: roleName === "Admin HRD" || roleName === "Manager HRD",
        create: roleName === "Admin HRD",
        read:
          roleName === "Admin HRD" || roleName === "Manager HRD" ? "All" : "No",
        update: roleName === "Admin HRD" ? "All" : "No",
        delete: roleName === "Admin HRD" ? "All" : "No",
      },
      {
        modul: "Tunjangan Transport",
        akses: roleName === "Admin HRD" || roleName === "Manager HRD",
        create: false,
        read:
          roleName === "Admin HRD" || roleName === "Manager HRD" ? "All" : "No",
        update: "No",
        delete: "No",
      },
      {
        modul: "Setting Tunjangan Transport",
        akses: roleName === "Admin HRD",
        create: roleName === "Admin HRD",
        read: roleName === "Admin HRD" ? "All" : "No",
        update: roleName === "Admin HRD" ? "All" : "No",
        delete: roleName === "Admin HRD" ? "All" : "No",
      },
      {
        modul: "Log Aktifitas",
        akses: roleName === "Superadmin",
        create: false,
        read: roleName === "Superadmin" ? "All" : "No",
        update: "No",
        delete: "No",
      },
    ];

    return {
      status: "success",
      data: {
        nama_role: roleName,
        deskripsi: `Hak akses role ${roleName}.`,
        permissions: permissions,
      },
    };
  } finally {
    conn.release();
  }
});
