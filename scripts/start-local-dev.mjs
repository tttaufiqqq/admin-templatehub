import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import readline from "node:readline";

const nextBin = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
);

const child = spawn(
  process.execPath,
  [nextBin, "dev", "--hostname", "localhost", "--webpack"],
  {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"],
  },
);

function pipeFiltered(stream, target) {
  const rl = readline.createInterface({ input: stream });

  rl.on("line", (line) => {
    if (line.includes("- Network:")) {
      return;
    }

    target.write(`${line}\n`);
  });
}

pipeFiltered(child.stdout, process.stdout);
pipeFiltered(child.stderr, process.stderr);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
