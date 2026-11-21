import { db } from "../database/sqliteDatabase.js";

export const cycleRepository = {
  findAll() {
    return db
      .prepare(
        "SELECT id, userId, startDate, endDate, flow, mood FROM cycles ORDER BY substr(startDate, 7, 4) || '-' || substr(startDate, 4, 2) || '-' || substr(startDate, 1, 2) DESC, id DESC"
      )
      .all();
  },

  findByUserId(userId) {
    return db
      .prepare(
        "SELECT id, userId, startDate, endDate, flow, mood FROM cycles WHERE userId = ? ORDER BY substr(startDate, 7, 4) || '-' || substr(startDate, 4, 2) || '-' || substr(startDate, 1, 2) DESC, id DESC"
      )
      .all(Number(userId));
  },

  findById(id) {
    return (
      db
        .prepare("SELECT id, userId, startDate, endDate, flow, mood FROM cycles WHERE id = ?")
        .get(Number(id)) || null
    );
  },

  saveAll(cycles) {
    const stmt = db.prepare(
      "UPDATE cycles SET startDate = ?, endDate = ?, flow = ?, mood = ? WHERE id = ?"
    );
    cycles.forEach((c) => {
      stmt.run(c.startDate, c.endDate ?? null, c.flow, c.mood, Number(c.id));
    });
    return this.findAll();
  },

  create(cycleData) {
    const result = db
      .prepare(
        "INSERT INTO cycles (userId, startDate, endDate, flow, mood) VALUES (?, ?, ?, ?, ?)"
      )
      .run(
        Number(cycleData.userId),
        cycleData.startDate,
        cycleData.endDate ?? null,
        cycleData.flow,
        cycleData.mood
      );
    return this.findById(result.lastInsertRowid);
  },

  update(id, cycleData) {
    const current = this.findById(id);
    if (!current) return null;

    const updated = {
      ...current,
      ...cycleData,
    };

    db.prepare(
      "UPDATE cycles SET userId = ?, startDate = ?, endDate = ?, flow = ?, mood = ? WHERE id = ?"
    ).run(
      Number(updated.userId),
      updated.startDate,
      updated.endDate ?? null,
      updated.flow,
      updated.mood,
      Number(id)
    );

    return this.findById(id);
  },

  remove(id) {
    const current = this.findById(id);
    if (!current) return null;
    db.prepare("DELETE FROM cycles WHERE id = ?").run(Number(id));
    return current;
  },
};
