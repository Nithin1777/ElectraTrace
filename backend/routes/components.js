const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all components
router.get("/", async (req, res) => {
  const { category, q } = req.query;
  const limit = req.query.limit ? Number(req.query.limit) : null;
  const offset = req.query.offset ? Number(req.query.offset) : null;
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

    if (Number.isFinite(limit) && limit > 0) {
      sql += " LIMIT ?";
      params.push(Math.min(limit, 500));
      if (Number.isFinite(offset) && offset >= 0) {
        sql += " OFFSET ?";
        params.push(offset);
      }
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
  if (!MPN || !MPN.trim()) {
    return res.status(400).json({ error: "MPN is required" });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO COMPONENTS (MPN, Description, Category, Datasheet_URL) VALUES (?, ?, ?, ?)",
      [
        MPN.trim(),
        Description || null,
        Category || null,
        Datasheet_URL || null,
      ],
    );
    res.status(201).json({
      Comp_ID: result.insertId,
      MPN: MPN.trim(),
      Description: Description || null,
      Category: Category || null,
      Datasheet_URL: Datasheet_URL || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update component
router.put("/:id", async (req, res) => {
  const { MPN, Description, Category, Datasheet_URL } = req.body;
  if (!MPN || !MPN.trim()) {
    return res.status(400).json({ error: "MPN is required" });
  }
  try {
    const [result] = await db.query(
      "UPDATE COMPONENTS SET MPN = ?, Description = ?, Category = ?, Datasheet_URL = ? WHERE Comp_ID = ?",
      [
        MPN.trim(),
        Description || null,
        Category || null,
        Datasheet_URL || null,
        req.params.id,
      ],
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
