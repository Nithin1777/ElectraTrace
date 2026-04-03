const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all BOM items
router.get("/", async (req, res) => {
  try {
    const [items] = await db.query("SELECT * FROM BOM_ITEMS");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all items in a BOM
router.get("/bom/:bomId", async (req, res) => {
  try {
    const [items] = await db.query(
      `
            SELECT bi.*, c.MPN, c.Description, c.Category 
            FROM BOM_ITEMS bi
            JOIN COMPONENTS c ON bi.Comp_ID = c.Comp_ID
            WHERE bi.BOM_ID = ?
        `,
      [req.params.bomId],
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single BOM item
router.get("/:id", async (req, res) => {
  try {
    const [items] = await db.query(
      `
        SELECT bi.*, c.MPN, c.Description, c.Category
        FROM BOM_ITEMS bi
        JOIN COMPONENTS c ON bi.Comp_ID = c.Comp_ID
        WHERE bi.BOM_ItemID = ?
      `,
      [req.params.id],
    );
    if (!items.length) {
      return res.status(404).json({ error: "BOM item not found" });
    }
    res.json(items[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create BOM Item
router.post("/", async (req, res) => {
  const { BOM_ID, Comp_ID, parent_BOM_ItemID, Quantity_Required, Status } =
    req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO BOM_ITEMS (BOM_ID, Comp_ID, parent_BOM_ItemID, Quantity_Required, Status) VALUES (?, ?, ?, ?, ?)",
      [
        BOM_ID,
        Comp_ID,
        parent_BOM_ItemID || null,
        Quantity_Required || 1,
        Status || "Pending",
      ],
    );
    res.status(201).json({
      BOM_ItemID: result.insertId,
      BOM_ID,
      Comp_ID,
      parent_BOM_ItemID,
      Quantity_Required,
      Status,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update BOM Item (trigger handles logging)
router.put("/:id", async (req, res) => {
  const { parent_BOM_ItemID, Quantity_Required, Status } = req.body;
  try {
    await db.query(
      "UPDATE BOM_ITEMS SET parent_BOM_ItemID = ?, Quantity_Required = ?, Status = ? WHERE BOM_ItemID = ?",
      [parent_BOM_ItemID || null, Quantity_Required, Status, req.params.id],
    );
    res.json({ message: "BOM Item updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete BOM Item
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM BOM_ITEMS WHERE BOM_ItemID = ?",
      [req.params.id],
    );
    if (!result.affectedRows) {
      return res.status(404).json({ error: "BOM item not found" });
    }
    res.json({ message: "BOM Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
