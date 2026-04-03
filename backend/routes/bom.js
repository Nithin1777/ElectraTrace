const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all BOMs
router.get("/", async (req, res) => {
  try {
    const [boms] = await db.query("SELECT * FROM BOM");
    res.json(boms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single BOM
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM BOM WHERE BOM_ID = ?", [
      req.params.id,
    ]);
    if (!rows.length) {
      return res.status(404).json({ error: "BOM not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get BOMs for a project
router.get("/project/:projId", async (req, res) => {
  try {
    const [boms] = await db.query("SELECT * FROM BOM WHERE Proj_ID = ?", [
      req.params.projId,
    ]);
    res.json(boms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Full BOM Details using Stored Procedure
router.get("/:id/full", async (req, res) => {
  try {
    // CALL the stored procedure
    const [results] = await db.query("CALL GetFullBOMDetails(?)", [
      req.params.id,
    ]);
    // The results array contains rows array as its first element
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create BOM
router.post("/", async (req, res) => {
  const { Proj_ID, BOM_Name } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO BOM (Proj_ID, BOM_Name) VALUES (?, ?)",
      [Proj_ID, BOM_Name],
    );
    res.status(201).json({ BOM_ID: result.insertId, Proj_ID, BOM_Name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update BOM
router.put("/:id", async (req, res) => {
  const { Proj_ID, BOM_Name } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE BOM SET Proj_ID = ?, BOM_Name = ? WHERE BOM_ID = ?",
      [Proj_ID, BOM_Name, req.params.id],
    );
    if (!result.affectedRows) {
      return res.status(404).json({ error: "BOM not found" });
    }
    res.json({ message: "BOM updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete BOM
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM BOM WHERE BOM_ID = ?", [
      req.params.id,
    ]);
    if (!result.affectedRows) {
      return res.status(404).json({ error: "BOM not found" });
    }
    res.json({ message: "BOM deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
