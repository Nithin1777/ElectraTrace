const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const projectsRoutes = require("./routes/projects");
const bomRoutes = require("./routes/bom");
const bomItemsRoutes = require("./routes/bomItems");
const componentsRoutes = require("./routes/components");
const footprintsRoutes = require("./routes/footprints");
const vendorsRoutes = require("./routes/vendors");
const listingsRoutes = require("./routes/listings");
const reportsRoutes = require("./routes/reports");

app.use("/api/projects", projectsRoutes);
app.use("/api/boms", bomRoutes);
app.use("/api/bom-items", bomItemsRoutes);
app.use("/api/components", componentsRoutes);
app.use("/api/footprints", footprintsRoutes);
app.use("/api/vendors", vendorsRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/api/reports", reportsRoutes);

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS solution");
    res.json({
      message: "Database connected successfully",
      solution: rows[0].solution,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await db.query("SELECT 1");
    console.log("Database connection successful.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    console.error(
      "Check backend/.env values (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME) and ensure the MySQL user has access.",
    );
    process.exit(1);
  }
}

startServer();
