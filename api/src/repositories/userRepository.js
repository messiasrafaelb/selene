import { db } from "../database/sqliteDatabase.js";

export const userRepository = {
  findAll() {
    return db.prepare("SELECT id, name, email, password, pin FROM users ORDER BY id ASC").all();
  },

  findById(id) {
    return (
      db
        .prepare("SELECT id, name, email, password, pin FROM users WHERE id = ?")
        .get(Number(id)) || null
    );
  },

  findByEmail(email) {
    const normalized = String(email || "").trim().toLowerCase();
    return (
      db
        .prepare("SELECT id, name, email, password, pin FROM users WHERE LOWER(email) = ?")
        .get(normalized) || null
    );
  },

  create(userData) {
    const result = db
      .prepare("INSERT INTO users (name, email, password, pin) VALUES (?, ?, ?, ?)")
      .run(userData.name, userData.email, userData.password, userData.pin);
    return this.findById(result.lastInsertRowid);
  },

  update(id, userData) {
    const current = this.findById(id);
    if (!current) return null;

    const updated = {
      ...current,
      ...userData,
    };

    db.prepare(
      "UPDATE users SET name = ?, email = ?, password = ?, pin = ? WHERE id = ?"
    ).run(updated.name, updated.email, updated.password, updated.pin, Number(id));

    return this.findById(id);
  },

  remove(id) {
    const current = this.findById(id);
    if (!current) return null;
    db.prepare("DELETE FROM users WHERE id = ?").run(Number(id));
    return current;
  },
};
