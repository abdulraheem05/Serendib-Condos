// Run after npm run build. Starts the production server temporarily, then stops it.
import { spawn } from "node:child_process";
import net from "node:net";
import assert from "node:assert/strict";
const free = net.createServer();
await new Promise((resolve) => free.listen(0, "127.0.0.1", resolve));
const port = free.address().port;
await new Promise((resolve) => free.close(resolve));
const origin = `http://127.0.0.1:${port}`;
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  { stdio: ["ignore", "pipe", "pipe"] },
);
let logs = "";
child.stdout.on("data", (d) => (logs += d));
child.stderr.on("data", (d) => (logs += d));
try {
  let response;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      response = await fetch(origin);
      if (response.ok) break;
    } catch {}
    if (child.exitCode !== null) throw new Error(`Server exited: ${logs}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.ok(response?.ok, `Production server did not start: ${logs}`);
  const html = await response.text();
  assert.ok(html.includes("Serendib Condos"));
  assert.ok(html.includes("Find your kind of place."));
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  for (const asset of [
    "/assets/hero.jpg",
    "/assets/colombo.jpg",
    "/assets/logo.png",
    "/assets/sources.json",
  ])
    assert.equal((await fetch(origin + asset)).status, 200, asset);
  assert.equal((await fetch(origin + "/missing-route")).status, 404);
  const optimized = await fetch(
    origin + "/_next/image?url=%2Fassets%2Faurora.jpg&w=640&q=75",
  );
  assert.equal(optimized.status, 200);
  assert.ok(optimized.headers.get("content-type").startsWith("image/"));
  console.log(
    "Passed: production startup, server-rendered content, assets, image optimization, security header and 404 handling.",
  );
} finally {
  child.kill("SIGTERM");
  await new Promise((resolve) => {
    if (child.exitCode !== null) return resolve();
    child.once("exit", resolve);
    setTimeout(() => {
      child.kill("SIGKILL");
      resolve();
    }, 5000).unref();
  });
}
