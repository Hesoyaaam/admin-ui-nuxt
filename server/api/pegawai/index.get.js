import db from "../../utils/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = query.search || "";
  const jabatan = query.jabatan || "";
  const statusKontrak = query.statusKontrak || "";
  const masaKerjaMin = query.masaKerjaMin ? parseInt(query.masaKerjaMin) : null;
  const masaKerjaMax = query.masaKerjaMax ? parseInt(query.masaKerjaMax) : null;

  const sortBy = query.sortBy || "id";
  const sortOrder =
    (query.sortOrder || "desc").toUpperCase() === "ASC" ? "ASC" : "DESC";

  const allowedSortColumns = {
    nip: "p.nip",
    nama: "p.nama_pegawai",
    jabatan: "j.nama",
    tanggal_masuk: "p.tanggal_masuk",
    masa_kerja: "masa_kerja",
    id: "p.id",
  };
  const orderColumn = allowedSortColumns[sortBy] || "p.id";

  let whereClause = "WHERE 1=1";
  const queryParams = [];

  if (search) {
    whereClause += ` AND (p.nip LIKE ? OR p.nama_pegawai LIKE ? OR j.nama LIKE ?)`;
    const searchPattern = `%${search}%`;
    queryParams.push(searchPattern, searchPattern, searchPattern);
  }

  if (jabatan) {
    whereClause += ` AND j.nama = ?`;
    queryParams.push(jabatan);
  }

  if (statusKontrak) {
    whereClause += ` AND p.jenis_kontrak = ?`;
    queryParams.push(statusKontrak);
  }

  if (masaKerjaMin !== null) {
    whereClause += ` AND TIMESTAMPDIFF(YEAR, p.tanggal_masuk, CURDATE()) >= ?`;
    queryParams.push(masaKerjaMin);
  }
  if (masaKerjaMax !== null) {
    whereClause += ` AND TIMESTAMPDIFF(YEAR, p.tanggal_masuk, CURDATE()) <= ?`;
    queryParams.push(masaKerjaMax);
  }

  const conn = await db.getConnection();
  try {
    const countSql = `
      SELECT COUNT(*) as total 
      FROM pegawai p
      LEFT JOIN master_data j ON p.id_jabatan = j.id
      LEFT JOIN master_data d ON p.id_departemen = d.id
      ${whereClause}
    `;
    const countResult = await conn.query(countSql, queryParams);
    const totalRows = Number(countResult[0].total);

    const dataSql = `
      SELECT 
        p.id, 
        p.nip, 
        p.nama_pegawai, 
        j.nama as jabatan,
        d.nama as departemen,
        p.tanggal_masuk, 
        p.jenis_kontrak,
        p.status,
        TIMESTAMPDIFF(YEAR, p.tanggal_masuk, CURDATE()) AS masa_kerja
      FROM pegawai p
      LEFT JOIN master_data j ON p.id_jabatan = j.id
      LEFT JOIN master_data d ON p.id_departemen = d.id
      ${whereClause}
      ORDER BY ${orderColumn} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const dataResult = await conn.query(dataSql, [
      ...queryParams,
      limit,
      offset,
    ]);

    const serializedData = dataResult.map((row) => {
      const newRow = {};
      for (const key in row) {
        newRow[key] =
          typeof row[key] === "bigint" ? Number(row[key]) : row[key];
      }
      return newRow;
    });

    return {
      status: "success",
      data: serializedData,
      meta: {
        page: Number(page),
        limit: Number(limit),
        totalRows: Number(totalRows),
        totalPages: Math.ceil(Number(totalRows) / Number(limit)),
      },
    };
  } catch (error) {
    console.error("ERROR FETCH DAFTAR PEGAWAI:", error.message);
    throw createError({
      statusCode: 500,
      statusMessage: "Terjadi kesalahan pada server",
      message: error.message,
    });
  } finally {
    conn.release();
  }
});
