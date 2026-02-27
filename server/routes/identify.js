import express from "express";
import { identifyContact } from "../services/identityService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res
        .status(400)
        .json({ error: "Email or phoneNumber required" });
    }

    const response = await identifyContact(
      email,
      phoneNumber
    );

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;