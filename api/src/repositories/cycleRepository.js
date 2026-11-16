import {
  readCollection,
  writeCollection,
  generateNextId,
} from "../database/jsonDatabase.js";

const COLLECTION = "cycles";

export const cycleRepository = {
  findAll() {
    return readCollection(COLLECTION);
  },

  findByUserId(userId) {
    const cycles = readCollection(COLLECTION);
    return cycles.filter((cycle) => String(cycle.userId) === String(userId));
  },

  findById(id) {
    const cycles = readCollection(COLLECTION);
    return cycles.find((cycle) => String(cycle.id) === String(id)) || null;
  },

  saveAll(cycles) {
    writeCollection(COLLECTION, cycles);
    return cycles;
  },

  create(cycleData) {
    const cycles = readCollection(COLLECTION);
    const newCycle = {
      id: generateNextId(cycles),
      ...cycleData,
    };
    cycles.unshift(newCycle);
    writeCollection(COLLECTION, cycles);
    return newCycle;
  },

  update(id, cycleData) {
    const cycles = readCollection(COLLECTION);
    const index = cycles.findIndex((cycle) => String(cycle.id) === String(id));
    if (index === -1) return null;

    const updatedCycle = {
      ...cycles[index],
      ...cycleData,
      id: cycles[index].id,
    };
    cycles[index] = updatedCycle;
    writeCollection(COLLECTION, cycles);
    return updatedCycle;
  },

  remove(id) {
    const cycles = readCollection(COLLECTION);
    const index = cycles.findIndex((cycle) => String(cycle.id) === String(id));
    if (index === -1) return null;

    const [removed] = cycles.splice(index, 1);
    writeCollection(COLLECTION, cycles);
    return removed;
  },
};
