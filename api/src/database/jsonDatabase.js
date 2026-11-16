import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");

function resolveFilePath(collectionName) {
  return path.join(DATA_DIR, `${collectionName}.json`);
}

export function readCollection(collectionName) {
  const filePath = resolveFilePath(collectionName);
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

export function writeCollection(collectionName, data) {
  const filePath = resolveFilePath(collectionName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function generateNextId(items) {
  const maxId = items.reduce((max, item) => {
    const numericId = Number(item.id);
    return Number.isFinite(numericId) && numericId > max ? numericId : max;
  }, 0);
  return maxId + 1;
}
