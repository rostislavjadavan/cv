import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const chrome =
  process.env.CHROME_PATH ??
  (process.platform === "darwin"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : "google-chrome");
const input = resolve("index.html");
const output = resolve("cv.pdf");

if (existsSync(output)) unlinkSync(output);

const result = spawnSync(
  chrome,
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--print-to-pdf=${output}`,
    pathToFileURL(input).href,
  ],
  { encoding: "utf8", timeout: 30_000 },
);

const pdf = existsSync(output) ? readFileSync(output) : null;
const hasPdfHeader = pdf?.subarray(0, 5).toString() === "%PDF-";
const hasEofMarker = pdf?.subarray(-1024).includes(Buffer.from("%%EOF"));

if (!hasPdfHeader || !hasEofMarker) {
  process.stderr.write(result.stderr || result.error?.message || "PDF export failed\n");
  process.exit(result.status || 1);
}

console.log(`Wrote ${pdf.length} bytes to ${output}`);
