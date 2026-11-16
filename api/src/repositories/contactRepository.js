import {
  readCollection,
  writeCollection,
  generateNextId,
} from "../database/jsonDatabase.js";

const COLLECTION = "contacts";

export const contactRepository = {
  findAll() {
    return readCollection(COLLECTION);
  },

  findByUserId(userId) {
    const contacts = readCollection(COLLECTION);
    return contacts.filter((contact) => String(contact.userId) === String(userId));
  },

  findById(id) {
    const contacts = readCollection(COLLECTION);
    return contacts.find((contact) => String(contact.id) === String(id)) || null;
  },

  create(contactData) {
    const contacts = readCollection(COLLECTION);
    const newContact = {
      id: generateNextId(contacts),
      ...contactData,
    };
    contacts.push(newContact);
    writeCollection(COLLECTION, contacts);
    return newContact;
  },

  update(id, contactData) {
    const contacts = readCollection(COLLECTION);
    const index = contacts.findIndex((contact) => String(contact.id) === String(id));
    if (index === -1) return null;

    const updatedContact = {
      ...contacts[index],
      ...contactData,
      id: contacts[index].id,
    };
    contacts[index] = updatedContact;
    writeCollection(COLLECTION, contacts);
    return updatedContact;
  },

  remove(id) {
    const contacts = readCollection(COLLECTION);
    const index = contacts.findIndex((contact) => String(contact.id) === String(id));
    if (index === -1) return null;

    const [removed] = contacts.splice(index, 1);
    writeCollection(COLLECTION, contacts);
    return removed;
  },
};
