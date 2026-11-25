import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "The office printer only jams on deadline day. It reads my calendar better than my manager does.";

if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`line must be 1 to 200 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("line must not be only whitespace");
}
if (Buffer.byteLength(LINE, "utf8") > 200) {
  throw new Error("line must be at most 200 bytes");
}
if (LINE !== LINE.trim()) {
  throw new Error("line must not start or end with whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be a single line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("round-trip check failed: entry.txt does not match the line");
}
if (Buffer.byteLength(back, "utf8") !== LINE.length) {
  throw new Error("round-trip check failed: byte length mismatch");
}
console.log(`wrote ${outPath} (${LINE.length} characters)`);
