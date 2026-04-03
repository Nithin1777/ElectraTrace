const express = require("express");
const router = express.Router();
const db = require("../db");

// Get view of available stock (joins listings, components, vendors)
router.get("/available-stock", async (req, res) => {
  try {
    const [listings] = await db.query("SELECT * FROM available_stock_view");
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Vendor
router.post("/vendors", async (req, res) => {
  const { Vendor_Name, Location_City, GSTIN, Contact_Info, Website } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO VENDORS_IN (Vendor_Name, Location_City, GSTIN, Contact_Info, Website) VALUES (?, ?, ?, ?, ?)",
      [Vendor_Name, Location_City, GSTIN, Contact_Info, Website],
    );
    res.status(201).json({ Vendor_ID: result.insertId, Vendor_Name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all footprints
router.get("/footprints", async (req, res) => {
  try {
    const [footprints] = await db.query(
      "SELECT f.*, c.MPN FROM FOOTPRINTS f JOIN COMPONENTS c ON f.Comp_ID = c.Comp_ID",
    );
    res.json(footprints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
