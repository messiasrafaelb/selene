import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "selene.sqlite");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const db = new DatabaseSync(DB_PATH);

db.exec("PRAGMA foreign_keys = ON;");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    pin TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cycles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT,
    flow TEXT NOT NULL,
    mood TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    phone TEXT NOT NULL,
    priority TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );
`);

function readJsonSeed(name) {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function seedInitialDataIfEmpty() {
  const row = db.prepare("SELECT COUNT(*) AS count FROM users").get();
  if (row && row.count > 0) return;

  const users = readJsonSeed("users");
  const insertUser = db.prepare(
    "INSERT INTO users (id, name, email, password, pin) VALUES (?, ?, ?, ?, ?)"
  );
  users.forEach((u) => {
    insertUser.run(u.id, u.name, u.email, u.password, u.pin);
  });

  const cycles = readJsonSeed("cycles");
  const insertCycle = db.prepare(
    "INSERT INTO cycles (id, userId, startDate, endDate, flow, mood) VALUES (?, ?, ?, ?, ?, ?)"
  );
  cycles.forEach((c) => {
    insertCycle.run(c.id, c.userId, c.startDate, c.endDate ?? null, c.flow, c.mood);
  });

  const contacts = readJsonSeed("contacts");
  const insertContact = db.prepare(
    "INSERT INTO contacts (id, userId, name, relationship, phone, priority) VALUES (?, ?, ?, ?, ?, ?)"
  );
  contacts.forEach((ct) => {
    insertContact.run(
      ct.id,
      ct.userId,
      ct.name,
      ct.relationship || "Rede de Apoio",
      ct.phone,
      ct.priority || "Apoio rápido"
    );
  });
}

seedInitialDataIfEmpty();
