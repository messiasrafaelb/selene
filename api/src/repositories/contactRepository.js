import { db } from "../database/sqliteDatabase.js";

export const contactRepository = {
  findAll() {
    return db
      .prepare(
        "SELECT id, userId, name, relationship, phone, priority FROM contacts ORDER BY id ASC"
      )
      .all();
  },

  findByUserId(userId) {
    return db
      .prepare(
        "SELECT id, userId, name, relationship, phone, priority FROM contacts WHERE userId = ? ORDER BY id ASC"
      )
      .all(Number(userId));
  },

  findById(id) {
    return (
      db
        .prepare(
          "SELECT id, userId, name, relationship, phone, priority FROM contacts WHERE id = ?"
        )
        .get(Number(id)) || null
    );
  },

  create(contactData) {
    const result = db
      .prepare(
        "INSERT INTO contacts (userId, name, relationship, phone, priority) VALUES (?, ?, ?, ?, ?)"
      )
      .run(
        Number(contactData.userId),
        contactData.name,
        contactData.relationship,
        contactData.phone,
        contactData.priority
      );
    return this.findById(result.lastInsertRowid);
  },

  update(id, contactData) {
    const current = this.findById(id);
    if (!current) return null;

    const updated = {
      ...current,
      ...contactData,
    };

    db.prepare(
      "UPDATE contacts SET userId = ?, name = ?, relationship = ?, phone = ?, priority = ? WHERE id = ?"
    ).run(
      Number(updated.userId),
      updated.name,
      updated.relationship,
      updated.phone,
      updated.priority,
      Number(id)
    );

    return this.findById(id);
  },

  remove(id) {
    const current = this.findById(id);
    if (!current) return null;
    db.prepare("DELETE FROM contacts WHERE id = ?").run(Number(id));
    return current;
  },
};
