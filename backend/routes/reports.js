const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/available-stock", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM available_stock_view ORDER BY Last_Updated DESC",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/bom-item-logs", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM BOM_ITEM_LOGS ORDER BY Changed_At DESC",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
