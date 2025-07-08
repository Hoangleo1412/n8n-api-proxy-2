export default async function handler(req, res) {
  const targetUrl = "https://dacdev.com/api/v1";

  try {
    // Headers giả lập trình duyệt + API key
    const headers = {
      "x-api-key": "f435d83dbce7489b88c307841bfaff03",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36",
      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.5",
    };

    const bodyChunks = [];

    // Bắt sự kiện đọc stream body
    req.on("data", chunk => bodyChunks.push(chunk));
    req.on("end", async () => {
      const rawBody = Buffer.concat(bodyChunks);

      const response = await fetch(targetUrl, {
        method: req.method,
        headers,
        body: req.method !== "GET" && req.method !== "HEAD" ? rawBody : undefined,
      });

      // Lấy content-type từ API gốc
      const contentType = response.headers.get("content-type") || "application/octet-stream";
      res.status(response.status);
      res.setHeader("Content-Type", contentType);

      const data = await response.arrayBuffer();
      res.send(Buffer.from(data));
    });

    req.on("error", error => {
      res.status(500).json({ error: "Stream error", message: error.message });
    });

  } catch (err) {
    res.status(500).json({
      error: "Proxy failed",
      message: err.message,
    });
  }
}
