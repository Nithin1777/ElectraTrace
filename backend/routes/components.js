const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all components
router.get("/", async (req, res) => {
  const { category, q } = req.query;
  try {
    let sql = "SELECT * FROM COMPONENTS WHERE 1=1";
    const params = [];

    if (category) {
      sql += " AND Category = ?";
      params.push(category);
    }

    if (q) {
      sql += " AND (MPN LIKE ? OR Description LIKE ?)";
      params.push(`%${q}%`, `%${q}%`);
    }

    const [components] = await db.query(sql, params);
    res.json(components);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single component
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM COMPONENTS WHERE Comp_ID = ?",
      [req.params.id],
    );
    if (!rows.length) {
      return res.status(404).json({ error: "Component not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create component
router.post("/", async (req, res) => {
  const { MPN, Description, Category, Datasheet_URL } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO COMPONENTS (MPN, Description, Category, Datasheet_URL) VALUES (?, ?, ?, ?)",
      [MPN, Description, Category, Datasheet_URL],
    );
    res.status(201).json({
      Comp_ID: result.insertId,
      MPN,
      Description,
      Category,
      Datasheet_URL,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update component
router.put("/:id", async (req, res) => {
  const { MPN, Description, Category, Datasheet_URL } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE COMPONENTS SET MPN = ?, Description = ?, Category = ?, Datasheet_URL = ? WHERE Comp_ID = ?",
      [MPN, Description, Category, Datasheet_URL, req.params.id],
    );
    if (!result.affectedRows) {
      return res.status(404).json({ error: "Component not found" });
    }
    res.json({ message: "Component updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete component
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM COMPONENTS WHERE Comp_ID = ?",
      [req.params.id],
    );
    if (!result.affectedRows) {
      return res.status(404).json({ error: "Component not found" });
    }
    res.json({ message: "Component deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
