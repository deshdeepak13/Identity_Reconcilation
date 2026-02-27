import dotenv from "dotenv";
import { sequelize, Contact } from "./models/index.js";

dotenv.config();

const seed = async () => {
  try {
    console.log("Connecting to database...");

    await sequelize.authenticate();
    console.log("Database connected.");

    await Contact.destroy({
      where: {},
      truncate: true,
      restartIdentity: true
    });

    console.log("Old data cleared.");

    const contact1 = await Contact.create({
      phoneNumber: "123456",
      email: "lorraine@hillvalley.edu",
      linkPrecedence: "primary"
    });

    await Contact.create({
      phoneNumber: "123456",
      email: "mcfly@hillvalley.edu",
      linkedId: contact1.id,
      linkPrecedence: "secondary"
    });

    await Contact.create({
      phoneNumber: "919191",
      email: "george@hillvalley.edu",
      linkPrecedence: "primary"
    });

    await Contact.create({
      phoneNumber: "717171",
      email: "biffsucks@hillvalley.edu",
      linkPrecedence: "primary"
    });

    console.log("Dummy data inserted successfully.");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();