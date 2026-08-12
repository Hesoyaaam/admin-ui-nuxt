import jwt from "jsonwebtoken";

export const getAuthUserId = (event) => {
  const token = getCookie(event, "auth_token");
  if (!token) return null;

  try {
    const config = useRuntimeConfig();
    const secret = process.env.JWT_SECRET || config.jwtSecret;
    const decoded = jwt.verify(token, secret);
    return decoded.id || null;
  } catch (e) {
    return null;
  }
};
