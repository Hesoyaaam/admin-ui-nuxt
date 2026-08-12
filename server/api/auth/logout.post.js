import { catatLog } from "../../utils/logger";
import { getAuthUserId } from "../../utils/auth";
import db from "../../utils/db";

export default defineEventHandler(async (event) => {
  const currentUserId = getAuthUserId(event);

  let username = "User";

  if (currentUserId) {
    const conn = await db.getConnection();
    try {
      const result = await conn.query(
        "SELECT username FROM user WHERE id = ?",
        [currentUserId],
      );
      const rows =
        Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
      if (rows && rows.length > 0) {
        username = rows[0].username;
      }
    } finally {
      conn.release();
    }
  }

  await catatLog(
    event,
    "Autentikasi",
    `LOGOUT: User ${username} keluar dari sistem`,
    currentUserId,
  );

  deleteCookie(event, "auth_token", { path: "/" });

  return {
    status: "success",
    message: "Logout berhasil",
  };
});
