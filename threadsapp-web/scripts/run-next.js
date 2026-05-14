const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const tempDir = path.join(__dirname, "..", ".tmp");
fs.mkdirSync(tempDir, { recursive: true });

const env = {
  ...process.env,
  TEMP: tempDir,
  TMP: tempDir,
  TMPDIR: tempDir,
};

const nextBin = require.resolve("next/dist/bin/next");
const args = [nextBin, ...process.argv.slice(2)];

const child = spawn(process.execPath, args, {
  stdio: "inherit",
  env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
