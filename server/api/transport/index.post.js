import db from "../../utils/db";
import { transportSettingSchema } from "../../utils/schemas";
import { catatLog } from "../../utils/logger";
import { getAuthUserId } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const currentUserId = getAuthUserId(event);

  const rawBody = await readBody(event);
  const conn = await db.getConnection();

  const parsedData = transportSettingSchema.safeParse(rawBody);

  if (!parsedData.success) {
    const errorMessages = parsedData.error.issues
      .map((i) => i.message)
      .join(", ");
    throw createError({
      statusCode: 400,
      message: errorMessages,
    });
  }

  const body = parsedData.data;

  try {
    await conn.beginTransaction();

    await conn.query(
      `
      INSERT INTO setting_transport 
      (tarif_per_km, min_km, max_km, berlaku_mulai) 
      VALUES (?, ?, ?, ?)
    `,
      [body.tarif_per_km, body.min_km, body.max_km, body.berlaku_mulai],
    );

    await conn.commit();

    await catatLog(
      event,
      "Manajemen Transport",
      `Create: Menambahkan: ${id}`,
      currentUserId,
    );

    return {
      status: "success",
      message: "Pengaturan tunjangan transport berhasil disimpan",
    };
  } catch (error) {
    await conn.rollback();
    console.error("ERROR SIMPAN SETTING TRANSPORT:", error.message);

    throw createError({
      statusCode: 500,
      statusMessage: "DB_ERROR",
      message: error.message,
    });
  } finally {
    conn.release();
  }
});
