export default async function handler(req, res) {
  const path = req.url.replace("/api/proxy", "");
  const targetUrl = `https://dacdev.com/api/v1${path}`;

  // Copy headers ngoại trừ host và x-forwarded-for để tránh bị chặn
  const filteredHeaders = Object.fromEntries(
    Object.entries(req.headers).filter(
      ([key]) => !["host", "x-forwarded-for"].includes(key.toLowerCase())
    )
  );

  // Gắn x-api-key thủ công
  filteredHeaders['x-api-key'] = 'f435d83dbce7489b88c307841bfaff03';

  // Chuẩn hóa body nếu có
  const body = req.method !== "GET" && req.method !== "HEAD"
    ? await new Promise((resolve) => {
        let data = [];
        req.on("data", chunk => data.push(chunk));
        req.on("end", () => resolve(Buffer.concat(data)));
      })
    : undefined;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: filteredHeaders,
      body,
    });

    const responseBody = await response.arrayBuffer();
    res.status(response.status);
    response.headers.forEach((v, k) => res.setHeader(k, v));
    res.send(Buffer.from(responseBody));
  } catch (err) {
    res.status(500).json({ error: "Proxy error", message: err.message });
  }
}