// Dependency-free web server: serves public/ and a small JSON API.
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const port = Number(process.env.PORT || 8080);
const publicDir = path.join(__dirname, "public");
const contentTypes = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml" };

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/api/health") {
    return sendJson(res, 200, { status: "ok" });
  }
  if (url.pathname === "/api/info") {
    return sendJson(res, 200, {
      namespace: process.env.STAGE_NAMESPACE || "unknown",
      pod: os.hostname(),
      node: process.version,
      time: new Date().toISOString(),
    });
  }

  const file = path.normalize(path.join(publicDir, url.pathname === "/" ? "index.html" : url.pathname));
  if (!file.startsWith(publicDir)) {
    res.writeHead(400);
    return res.end();
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end("Not found");
    }
    res.writeHead(200, { "Content-Type": contentTypes[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
process.on("SIGTERM", () => server.close(() => process.exit(0)));
