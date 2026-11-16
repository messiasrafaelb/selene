import { contactService } from "../services/contactService.js";

export const contactController = {
  list(req, res) {
    const contacts = contactService.list(req.query.userId);
    return res.status(200).json(contacts);
  },

  getById(req, res) {
    const contact = contactService.getById(req.params.id);
    return res.status(200).json(contact);
  },

  create(req, res) {
    const created = contactService.create(req.body);
    return res.status(201).json(created);
  },

  update(req, res) {
    const updated = contactService.update(req.params.id, req.body);
    return res.status(200).json(updated);
  },

  remove(req, res) {
    const result = contactService.remove(req.params.id);
    return res.status(200).json(result);
  },
};
