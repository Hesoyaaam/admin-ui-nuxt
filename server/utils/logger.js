import db from "./db";

/**
 * @param {Object} event
 * @param {String} title
 * @param {String} content
 * @param {Number} userId
 */
export const catatLog = async (event, title, content, userId = null) => {
  const conn = await db.getConnection();
  try {
    const ua = getRequestHeader(event, "user-agent") || "";
    const ip =
      getRequestHeader(event, "x-forwarded-for") ||
      event.node.req.socket.remoteAddress ||
      "";
    const url = getRequestURL(event).pathname;

    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    await conn.query(
      `
      INSERT INTO activities (title, content, ua, ip, url, created_at, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [title, content, ua, ip, url, now, userId],
    );
  } catch (error) {
    console.error("GAGAL MENCATAT LOG:", error.message);
  } finally {
    conn.release();
  }
};
