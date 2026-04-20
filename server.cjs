const express = require("express");
const fs = require("fs");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = Number(process.env.PORT) || 3000;
const rawBackendTarget =
  (process.env.BACKEND_INTERNAL_URL ||
    "http://fairplay-gamified-backend.railway.internal").trim();
const backendTarget = (
  /^https?:\/\//i.test(rawBackendTarget)
    ? rawBackendTarget
    : `http://${rawBackendTarget}`
).replace(/\/+$/, "");
const buildDir = path.join(__dirname, "build");
const indexFile = path.join(buildDir, "index.html");
const hasBuildArtifacts = fs.existsSync(indexFile);

app.get("/health", (_req, res) => {
  res.json({ ok: true, hasBuildArtifacts });
});

app.use(
  "/api",
  createProxyMiddleware({
    target: backendTarget,
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  })
);

if (hasBuildArtifacts) {
  app.use(express.static(buildDir));
}

app.get("*", (_req, res) => {
  if (hasBuildArtifacts) {
    return res.sendFile(indexFile);
  }

  return res.status(200).send(
    "Frontend server is running, but build artifacts are missing. Ensure Railway Build Command is: npm run build"
  );
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Frontend listening on port ${port}`);
  console.log(`Proxying /api to ${backendTarget}`);
  console.log(`Build artifacts found: ${hasBuildArtifacts}`);
});
