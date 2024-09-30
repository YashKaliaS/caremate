const { Task } = require("../models/user"); 

const todoPostController = async (req, res) => {
    console.log("helo");
    console.log("req.body: ", req.body);
    const { name, description, deadline, category, authorId } = req.body;

    try {
        // Create a new task using the Task model
        const newTask = new Task({
            name,
            description,
            deadline,
            category,
            authorId, // Ensure this is provided and corresponds to the authenticated user
        });

        // Save the task to the database
        const savedTask = await newTask.save();

        // Respond with the created task
        res.status(201).json(savedTask);
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).send("Server Error");
    }
}

const todoGetController =  async (req, res) => {
    try {
        const userId = req.user._id; // Assuming req.user is populated by authentication middleware
        const tasks = await Task.find({ authorId: userId });
        res.json({ tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Server Error");
    }
}

module.exports = {todoPostController, todoGetController};