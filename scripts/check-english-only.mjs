import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ignoredDirectories = new Set(["node_modules", "dist", "coverage", ".git", "test-results", "playwright-report"]);
const checkedExtensions = new Set([".ts", ".tsx", ".js", ".mjs", ".html", ".css", ".md", ".json"]);
function extensionOf(filePath) {
  const match = filePath.match(/\.[^.]+$/);
  return match ? match[0] : "";
}

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return ignoredDirectories.has(entry) ? [] : walk(fullPath);
    }

    return checkedExtensions.has(extensionOf(fullPath)) ? [fullPath] : [];
  });
}

const violations = [];

for (const filePath of walk(process.cwd())) {
  const content = readFileSync(filePath, "utf8");

  if (/[^\x09\x0a\x0d\x20-\x7e]/.test(content)) {
    violations.push(filePath);
  }
}

if (violations.length > 0) {
  console.error("Non-ASCII source text found:");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("English-only source check passed.");
