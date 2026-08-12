import crypto from "crypto";

export default defineEventHandler(async (event) => {
  const text = crypto.randomBytes(3).toString("hex").toUpperCase();
  const captchaId = crypto.randomUUID();

  const storage = useStorage();
  await storage.setItem(`cache:captcha:${captchaId}`, text, { ttl: 300 });

  const svg = `
    <svg width="150" height="50" viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg">
      <rect width="150" height="50" fill="#f0f0f0" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="28" font-family="monospace" fill="#333" letter-spacing="4">
        ${text}
      </text>
      <!-- Garis coretan (noise) untuk mengelabui bot -->
      <line x1="10" y1="10" x2="140" y2="40" stroke="#888" stroke-width="2"/>
      <line x1="10" y1="40" x2="140" y2="10" stroke="#888" stroke-width="2"/>
    </svg>
  `;

  const base64Image = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  return {
    status: "success",
    data: {
      captcha_id: captchaId,
      image: base64Image,
    },
  };
});
