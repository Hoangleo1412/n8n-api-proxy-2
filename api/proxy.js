export default async function handler(req, res) {
  const targetUrl = "https://dacdev.com/api/v1";

  try {
    const headers = new Headers(req.headers);
    headers.set("x-api-key", "f435d83dbce7489b88c307841bfaff03");
    headers.delete("host");
    headers.delete("x-forwarded-for");

    const body =
      req.method !== "GET" && req.method !== "HEAD"
        ? await new Promise((resolve, reject) => {
            const chunks = [];
            req.on("data", chunk => chunks.push(chunk));
            req.on("end", () => resolve(Buffer.concat(chunks)));
            req.on("error", err => reject(err));
          })
        : undefined;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    const buf = await response.arrayBuffer();
    res.status(response.status);
    response.headers.forEach((v, k) => res.setHeader(k, v));
    res.send(Buffer.from(buf));
  } catch (err) {
    res.status(500).json({
      error: "Proxy failed",
      message: err.message,
    });
  }
}
