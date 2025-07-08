export default async function handler(req, res) {
  const targetUrl = "https://dacdev.com/api/v1";

  try {
    const headers = {
      "x-api-key": "f435d83dbce7489b88c307841bfaff03",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36",
      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.5"
    };

    let rawBody;
    if (req.method !== "GET" && req.method !== "HEAD") {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      rawBody = Buffer.concat(chunks);
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: rawBody,
    });

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    res.status(response.status);
    res.setHeader("Content-Type", contentType);
    const data = await response.arrayBuffer();
    res.send(Buffer.from(data));
  } catch (err) {
    res.status(500).json({ error: "Proxy failed", message: err.message });
  }
}
