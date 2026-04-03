const express = require("express");
const router = express.Router();
const db = require("../db");

const parsePagination = (req) => {
  const limit = req.query.limit ? Number(req.query.limit) : null;
  const offset = req.query.offset ? Number(req.query.offset) : null;
  return {
    limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 500) : null,
    offset: Number.isFinite(offset) && offset >= 0 ? offset : null,
  };
};

const isValidBudget = (value) =>
  value === null || value === undefined || Number.isFinite(Number(value));

// Get all projects
router.get("/", async (req, res) => {
  const { limit, offset } = parsePagination(req);
  try {
    let sql = "SELECT * FROM PROJECTS ORDER BY Creation_Date DESC";
    const params = [];
    if (limit !== null) {
      sql += " LIMIT ?";
      params.push(limit);
      if (offset !== null) {
        sql += " OFFSET ?";
        params.push(offset);
      }
    }
    const [projects] = await db.query(sql, params);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single project
router.get("/:id", async (req, res) => {
  try {
    const [project] = await db.query(
      "SELECT * FROM PROJECTS WHERE Proj_ID = ?",
      [req.params.id],
    );
    if (project.length === 0)
      return res.status(404).json({ error: "Project not found" });
    res.json(project[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create project
router.post("/", async (req, res) => {
  const {
    Project_Name,
    Description,
    Total_Est_Budget,
    Lead_Name,
    Due_Date,
    Version_Tag,
    Status,
  } = req.body;
  if (!Project_Name || !Project_Name.trim()) {
    return res.status(400).json({ error: "Project_Name is required" });
  }
  if (!isValidBudget(Total_Est_Budget)) {
    return res.status(400).json({ error: "Total_Est_Budget must be numeric" });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO PROJECTS (Project_Name, Description, Total_Est_Budget, Lead_Name, Due_Date, Version_Tag, Status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        Project_Name,
        Description || null,
        Total_Est_Budget ?? null,
        Lead_Name || null,
        Due_Date || null,
        Version_Tag || null,
        Status || "Active",
      ],
    );
    res.status(201).json({
      Proj_ID: result.insertId,
      Project_Name,
      Description: Description || null,
      Total_Est_Budget: Total_Est_Budget ?? null,
      Lead_Name: Lead_Name || null,
      Due_Date: Due_Date || null,
      Version_Tag: Version_Tag || null,
      Status: Status || "Active",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update project
router.put("/:id", async (req, res) => {
  const {
    Project_Name,
    Description,
    Total_Est_Budget,
    Lead_Name,
    Due_Date,
    Version_Tag,
    Status,
  } = req.body;
  if (!Project_Name || !Project_Name.trim()) {
    return res.status(400).json({ error: "Project_Name is required" });
  }
  if (!isValidBudget(Total_Est_Budget)) {
    return res.status(400).json({ error: "Total_Est_Budget must be numeric" });
  }
  try {
    await db.query(
      "UPDATE PROJECTS SET Project_Name = ?, Description = ?, Total_Est_Budget = ?, Lead_Name = ?, Due_Date = ?, Version_Tag = ?, Status = ? WHERE Proj_ID = ?",
      [
        Project_Name,
        Description || null,
        Total_Est_Budget ?? null,
        Lead_Name || null,
        Due_Date || null,
        Version_Tag || null,
        Status || "Active",
        req.params.id,
      ],
    );
    res.json({ message: "Project updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete project
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM PROJECTS WHERE Proj_ID = ?", [req.params.id]);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
