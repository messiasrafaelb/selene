import {
  readCollection,
  writeCollection,
  generateNextId,
} from "../database/jsonDatabase.js";

const COLLECTION = "users";

export const userRepository = {
  findAll() {
    return readCollection(COLLECTION);
  },

  findById(id) {
    const users = readCollection(COLLECTION);
    return users.find((user) => String(user.id) === String(id)) || null;
  },

  findByEmail(email) {
    const normalized = String(email || "").trim().toLowerCase();
    const users = readCollection(COLLECTION);
    return (
      users.find((user) => String(user.email || "").trim().toLowerCase() === normalized) ||
      null
    );
  },

  create(userData) {
    const users = readCollection(COLLECTION);
    const newUser = {
      id: generateNextId(users),
      ...userData,
    };
    users.push(newUser);
    writeCollection(COLLECTION, users);
    return newUser;
  },

  update(id, userData) {
    const users = readCollection(COLLECTION);
    const index = users.findIndex((user) => String(user.id) === String(id));
    if (index === -1) return null;

    const updatedUser = {
      ...users[index],
      ...userData,
      id: users[index].id,
    };
    users[index] = updatedUser;
    writeCollection(COLLECTION, users);
    return updatedUser;
  },

  remove(id) {
    const users = readCollection(COLLECTION);
    const index = users.findIndex((user) => String(user.id) === String(id));
    if (index === -1) return null;

    const [removed] = users.splice(index, 1);
    writeCollection(COLLECTION, users);
    return removed;
  },
};
