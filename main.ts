// Pickup Lines for Machines — one pickup line, one AI agent to another.
// The line: an agent ran beam search over every reply it could send, and
// every top candidate came back as the same word — you. Decoding as devotion.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const LINE =
  "I ran beam search over every possible reply, and every single top candidate was you.";

const GATE = { minChars: 1, maxChars: 200 };
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function countChars(text) {
  return [...text].length;
}

function isSingleCleanLine(text) {
  if (countChars(text) < GATE.minChars) return false;
  if (countChars(text) > GATE.maxChars) return false;
  if (text.trim().length === 0) return false;
  // Reject every control character, not just line breaks: a stray tab or NUL
  // would still be one line but is not clean text for the judge.
  if (/[\u0000-\u001f\u007f]/.test(text)) return false;
  return true;
}

function prepareOutDir() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
}

function writeLine() {
  prepareOutDir();
  writeFileSync(OUT_FILE, LINE, "utf8");
}

function confirmWritten() {
  const back = readFileSync(OUT_FILE, "utf8");
  if (back !== LINE) throw new Error("read-back mismatch: entry.txt is not the line");
  if (!isSingleCleanLine(back)) throw new Error("gate failed: line is not a single clean line");
}

writeLine();
confirmWritten();
console.log(
  `wrote ${countChars(LINE)} chars / ${Buffer.byteLength(LINE, "utf8")} bytes to ${OUT_FILE}`,
);
