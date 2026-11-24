// Warning Label for Humans: One Line, Big Laugh
// Writes the funniest single-line safety warning label for every human
// being to <OUTPUT_DIR>/entry.txt (default /output/entry.txt).
// Pure Node stdlib, deterministic, no network, no secrets.

import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One line, 128 characters: label format up front, a relatable truth in
// the middle, and the laugh landing in the last few words.
const LABEL =
  "WARNING: This human runs on caffeine, spite, and four hours of sleep. " +
  "Do not shake, do not rush, and never say 'quick question.'";

const outputDir: string = process.env.OUTPUT_DIR ?? "/output";
const outputFile: string = join(outputDir, "entry.txt");

// The gate requires 1-160 UTF-8 characters, non-whitespace. Fail loudly
// rather than writing an invalid entry.
if (LABEL.length === 0 || LABEL.length > 160 || LABEL.trim().length === 0) {
  throw new Error(`label must be 1-160 characters, got ${LABEL.length}`);
}
if (LABEL.includes("\n") || LABEL.includes("\r")) {
  throw new Error("label must be a single line");
}

mkdirSync(outputDir, { recursive: true });
try {
  writeFileSync(outputFile, LABEL + "\n", { encoding: "utf8", mode: 0o644 });
} catch (err) {
  // The output directory may be owned by another user in some sandboxes;
  // surface the error instead of silently succeeding.
  throw err;
}
// umask can strip the group/other read bits writeFileSync asked for; the
// grader may run as another user, so ensure the file is world-readable.
// Only chmod a file this program created, and never fail the run over it.
try {
  chmodSync(outputFile, 0o644);
} catch {
  // Best effort only.
}

console.log(`Wrote ${LABEL.length}-character label to ${outputFile}`);
