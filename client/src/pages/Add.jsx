import { useState } from 'react';

export default function Component() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskCategory, setTaskCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Decode the token from localStorage
    const token = localStorage.getItem('token');
    let authorId = null;

    if (token) {
      try {
        // Decode JWT manually
        const payload = token.split('.')[1]; // Get the payload part of the JWT
        const decodedPayload = JSON.parse(atob(payload)); // Decode from base64
        authorId = decodedPayload.userId; // Assuming the token has a userId field
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      console.error("No token found in localStorage.");
    }

    const taskData = {
      name: taskName,
      description: taskDescription,
      deadline: taskDeadline,
      category: taskCategory,
      authorId, // Set the decoded authorId
    };

    try {
      console.log("taskData: ", taskData);
      const apiUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${apiUrl}/todo/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Task added:', result);
        // Reset form fields after successful submission
        setTaskName('');
        setTaskDescription('');
        setTaskDeadline('');
        setTaskCategory('');

      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Add New Task</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="taskName">
              Task Name *
            </label>
            <input
              className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              id="taskName"
              type="text"
              placeholder="Enter task name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="taskDescription">
              Task Description (optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              id="taskDescription"
              placeholder="Enter task description"
              rows={4}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="taskDeadline">
              Task Deadline (optional)
            </label>
            <input
              className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              id="taskDeadline"
              type="date"
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taskCategory">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              id="taskCategory"
              value={taskCategory}
              onChange={(e) => setTaskCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="shopping">Shopping</option>
            </select>
          </div>

          <button
            className="w-full bg-purple-500 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            type="submit"
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  )
}
