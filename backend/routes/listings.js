const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : null;
  const offset = req.query.offset ? Number(req.query.offset) : null;
  try {
    let sql = "SELECT * FROM LISTINGS ORDER BY Listing_ID DESC";
    const params = [];
    if (Number.isFinite(limit) && limit > 0) {
      sql += " LIMIT ?";
      params.push(Math.min(limit, 500));
      if (Number.isFinite(offset) && offset >= 0) {
        sql += " OFFSET ?";
        params.push(offset);
      }
    }
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/component/:compId", async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : null;
  const offset = req.query.offset ? Number(req.query.offset) : null;
  try {
    let sql = `
      SELECT av.*
      FROM available_stock_view av
      WHERE av.Comp_ID = ?
      ORDER BY av.Price_INR ASC
      `;
    const params = [req.params.compId];
    if (Number.isFinite(limit) && limit > 0) {
      sql += " LIMIT ?";
      params.push(Math.min(limit, 200));
      if (Number.isFinite(offset) && offset >= 0) {
        sql += " OFFSET ?";
        params.push(offset);
      }
    }
    const [rows] = await db.query(sql, params);
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
  if (!Comp_ID || !Vendor_ID) {
    return res
      .status(400)
      .json({ error: "Comp_ID and Vendor_ID are required" });
  }
  if (!Number.isFinite(Number(Price_INR))) {
    return res.status(400).json({ error: "Price_INR must be numeric" });
  }
  if (!Number.isFinite(Number(Stock_Qty))) {
    return res.status(400).json({ error: "Stock_Qty must be numeric" });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO LISTINGS (Comp_ID, Vendor_ID, Price_INR, Stock_Qty, Purchase_URL) VALUES (?, ?, ?, ?, ?)",
      [
        Comp_ID,
        Vendor_ID,
        Number(Price_INR),
        Number(Stock_Qty),
        Purchase_URL || null,
      ],
    );
    res.status(201).json({
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
  if (!Comp_ID || !Vendor_ID) {
    return res
      .status(400)
      .json({ error: "Comp_ID and Vendor_ID are required" });
  }
  if (!Number.isFinite(Number(Price_INR))) {
    return res.status(400).json({ error: "Price_INR must be numeric" });
  }
  if (!Number.isFinite(Number(Stock_Qty))) {
    return res.status(400).json({ error: "Stock_Qty must be numeric" });
  }
  try {
    const [result] = await db.query(
      "UPDATE LISTINGS SET Comp_ID = ?, Vendor_ID = ?, Price_INR = ?, Stock_Qty = ?, Purchase_URL = ? WHERE Listing_ID = ?",
      [
        Comp_ID,
        Vendor_ID,
        Number(Price_INR),
        Number(Stock_Qty),
        Purchase_URL || null,
        req.params.id,
      ],
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
