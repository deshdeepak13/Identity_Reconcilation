import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./models/index.js";
import identifyRoute from "./routes/identify.js";
import contactsRoute from "./routes/contacts.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "*", // allow all origins (good for assignment/demo)
  methods: ["GET", "POST","DELETE"],
  credentials: true
}));


app.use(express.json());


app.use("/identify", identifyRoute);
app.use("/contacts", contactsRoute);


app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Identity Reconciliation Service is running"
  });
});



const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    await sequelize.sync();
    console.log("Database synced.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();