const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM VENDORS_IN ORDER BY Vendor_ID DESC",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM VENDORS_IN WHERE Vendor_ID = ?",
      [req.params.id],
    );
    if (!rows.length) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { Vendor_Name, Location_City, GSTIN, Contact_Info, Website } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO VENDORS_IN (Vendor_Name, Location_City, GSTIN, Contact_Info, Website) VALUES (?, ?, ?, ?, ?)",
      [Vendor_Name, Location_City, GSTIN, Contact_Info, Website],
    );
    res
      .status(201)
      .json({
        Vendor_ID: result.insertId,
        Vendor_Name,
        Location_City,
        GSTIN,
        Contact_Info,
        Website,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { Vendor_Name, Location_City, GSTIN, Contact_Info, Website } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE VENDORS_IN SET Vendor_Name = ?, Location_City = ?, GSTIN = ?, Contact_Info = ?, Website = ? WHERE Vendor_ID = ?",
      [Vendor_Name, Location_City, GSTIN, Contact_Info, Website, req.params.id],
    );
    if (!result.affectedRows) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.json({ message: "Vendor updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM VENDORS_IN WHERE Vendor_ID = ?",
      [req.params.id],
    );
    if (!result.affectedRows) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.json({ message: "Vendor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
