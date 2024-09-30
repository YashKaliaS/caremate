const express = require("express");// Make sure your Task model is defined in models/user
const { todoGetController, todoPostController} = require("../controllers/todo");
const router = express.Router();

// GET /api/tasks - Fetch all tasks for the user
router.get("/tasks", todoGetController);

// POST /api/tasks - Add a new task
router.post("/tasks", todoPostController);

module.exports = router;
