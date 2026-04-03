const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all projects
router.get("/", async (req, res) => {
  try {
    const [projects] = await db.query("SELECT * FROM PROJECTS");
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
  const { Project_Name, Description, Total_Est_Budget } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO PROJECTS (Project_Name, Description, Total_Est_Budget) VALUES (?, ?, ?)",
      [Project_Name, Description, Total_Est_Budget],
    );
    res
      .status(201)
      .json({
        Proj_ID: result.insertId,
        Project_Name,
        Description,
        Total_Est_Budget,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update project
router.put("/:id", async (req, res) => {
  const { Project_Name, Description, Total_Est_Budget } = req.body;
  try {
    await db.query(
      "UPDATE PROJECTS SET Project_Name = ?, Description = ?, Total_Est_Budget = ? WHERE Proj_ID = ?",
      [Project_Name, Description, Total_Est_Budget, req.params.id],
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
