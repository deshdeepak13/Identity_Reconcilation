import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./models/index.js";
// import identifyRoute from "./routes/identify.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


// app.use("/identify", identifyRoute);


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