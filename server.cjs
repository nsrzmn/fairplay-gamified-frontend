const express = require("express");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = Number(process.env.PORT) || 3000;
const backendTarget = (process.env.BACKEND_INTERNAL_URL || "http://fairplay-gamified-backend.railway.internal").replace(/\/+$/, "");
const buildDir = path.join(__dirname, "build");

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use(
  "/api",
  createProxyMiddleware({
    target: backendTarget,
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  })
);

app.use(express.static(buildDir));

app.get("*", (_req, res) => {
  res.sendFile(path.join(buildDir, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Frontend listening on port ${port}`);
  console.log(`Proxying /api to ${backendTarget}`);
});
