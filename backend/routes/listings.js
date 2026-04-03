const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM LISTINGS ORDER BY Listing_ID DESC",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/component/:compId", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT av.*
      FROM available_stock_view av
      WHERE av.Comp_ID = ?
      ORDER BY av.Price_INR ASC
      `,
      [req.params.compId],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM LISTINGS WHERE Listing_ID = ?",
      [req.params.id],
    );
    if (!rows.length) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { Comp_ID, Vendor_ID, Price_INR, Stock_Qty, Purchase_URL } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO LISTINGS (Comp_ID, Vendor_ID, Price_INR, Stock_Qty, Purchase_URL) VALUES (?, ?, ?, ?, ?)",
      [Comp_ID, Vendor_ID, Price_INR, Stock_Qty, Purchase_URL],
    );
    res
      .status(201)
      .json({
        Listing_ID: result.insertId,
        Comp_ID,
        Vendor_ID,
        Price_INR,
        Stock_Qty,
        Purchase_URL,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { Comp_ID, Vendor_ID, Price_INR, Stock_Qty, Purchase_URL } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE LISTINGS SET Comp_ID = ?, Vendor_ID = ?, Price_INR = ?, Stock_Qty = ?, Purchase_URL = ? WHERE Listing_ID = ?",
      [Comp_ID, Vendor_ID, Price_INR, Stock_Qty, Purchase_URL, req.params.id],
    );
    if (!result.affectedRows) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json({ message: "Listing updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM LISTINGS WHERE Listing_ID = ?",
      [req.params.id],
    );
    if (!result.affectedRows) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json({ message: "Listing deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
