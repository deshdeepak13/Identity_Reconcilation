import express from "express";
import { sequelize } from "../models/index.js";
import Contact from "../models/contact.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: contacts } = await Contact.findAndCountAll({
      limit,
      offset,
      order: [['id', 'DESC']]
    });

    res.status(200).json({
      contacts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalContacts: count
    });
  } catch (error) {
    console.error("Error fetching all contacts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    await contact.destroy();
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
