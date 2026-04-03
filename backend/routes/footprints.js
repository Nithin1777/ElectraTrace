const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT f.*, c.MPN
      FROM FOOTPRINTS f
      JOIN COMPONENTS c ON f.Comp_ID = c.Comp_ID
      ORDER BY f.FP_ID DESC
      `,
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM FOOTPRINTS WHERE FP_ID = ?", [
      req.params.id,
    ]);
    if (!rows.length) {
      return res.status(404).json({ error: "Footprint not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { Comp_ID, Package_Type, Footprint_Name, CAD_Link, Model_3D_Link } =
    req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO FOOTPRINTS (Comp_ID, Package_Type, Footprint_Name, CAD_Link, Model_3D_Link) VALUES (?, ?, ?, ?, ?)",
      [Comp_ID, Package_Type, Footprint_Name, CAD_Link, Model_3D_Link],
    );
    res
      .status(201)
      .json({
        FP_ID: result.insertId,
        Comp_ID,
        Package_Type,
        Footprint_Name,
        CAD_Link,
        Model_3D_Link,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { Comp_ID, Package_Type, Footprint_Name, CAD_Link, Model_3D_Link } =
    req.body;
  try {
    const [result] = await db.query(
      "UPDATE FOOTPRINTS SET Comp_ID = ?, Package_Type = ?, Footprint_Name = ?, CAD_Link = ?, Model_3D_Link = ? WHERE FP_ID = ?",
      [
        Comp_ID,
        Package_Type,
        Footprint_Name,
        CAD_Link,
        Model_3D_Link,
        req.params.id,
      ],
    );
    if (!result.affectedRows) {
      return res.status(404).json({ error: "Footprint not found" });
    }
    res.json({ message: "Footprint updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM FOOTPRINTS WHERE FP_ID = ?", [
      req.params.id,
    ]);
    if (!result.affectedRows) {
      return res.status(404).json({ error: "Footprint not found" });
    }
    res.json({ message: "Footprint deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
