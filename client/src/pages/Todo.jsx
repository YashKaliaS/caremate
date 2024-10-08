import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TodoList() {
  const navigate = useNavigate();
  
  // State management for tasks and form inputs
  const [tasks, setTasks] = useState([
    { id: 1, name: "Take medication", description: "Take heart medication with breakfast", deadline: "2024-09-30", category: "Health", completed: false },
    { id: 2, name: "Doctor's appointment", description: "Visit Dr. Smith at 2 PM", deadline: "2024-10-01", category: "Appointments", completed: false },
  ]);
  
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskCategory, setTaskCategory] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  //getting data from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks'); // Update the endpoint based on your backend
        const data = await response.json();
        setTasks(data.tasks);
        console.log("added through backend")
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);


  // Toggle completion status
  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Start editing task
  const startEditing = (task) => {
    setEditingTask(task);
    setTaskName(task.name);
    setTaskDescription(task.description);
    setTaskDeadline(task.deadline);
    setTaskCategory(task.category);
  };

  // Save edited task
  const saveEdit = () => {
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id
          ? { ...editingTask, name: taskName, description: taskDescription, deadline: taskDeadline, category: taskCategory }
          : task
      ));
      setEditingTask(null);
      resetForm();
    }
  };

  // Reset form inputs
  const resetForm = () => {
    setTaskName('');
    setTaskDescription('');
    setTaskDeadline('');
    setTaskCategory('');
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-8">

        {/* Toggle between active and completed tasks */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <div className="flex justify-between">
            <div>
              <button
                onClick={() => setShowCompleted(false)}
                className={`py-2 px-4 rounded-md ${!showCompleted ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Active Tasks
              </button>
              <button
                onClick={() => setShowCompleted(true)}
                className={`py-2 px-4 rounded-md ${showCompleted ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Completed Tasks
              </button>
            </div>
            <button
              onClick={() => navigate('/add-task')}
              className="py-2 px-4 bg-green-500 text-white rounded-md"
            >
              Add New Task
            </button>
          </div>
        </div>

        {/* Task list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(showCompleted ? completedTasks : activeTasks).map((task) => (
            <div key={task.id} className="bg-white shadow-lg rounded-lg">
              <div className="p-4">
                {editingTask && editingTask.id === task.id ? (
                  <div className="space-y-4">
                    {/* Editable inputs for name, description, deadline, and category */}
                    <input
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      placeholder="Task Name"
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      placeholder="Task Description"
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="date"
                      value={taskDeadline}
                      onChange={(e) => setTaskDeadline(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      value={taskCategory}
                      onChange={(e) => setTaskCategory(e.target.value)}
                      placeholder="Task Category"
                      className="w-full p-2 border rounded"
                    />
                    <button onClick={saveEdit} className="py-2 px-4 bg-blue-500 text-white rounded">Save</button>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <div>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id)}
                        className="mr-2"
                      />
                      <span className={`${task.completed ? 'line-through text-gray-500' : ''}`}>{task.name}</span>
                    </div>
                    <div className="text-sm">
                      <p>Deadline: {task.deadline}</p>
                      <p>Category: {task.category}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Task action buttons */}
              <div className="flex justify-end p-2 bg-gray-50 space-x-2">
                <button onClick={() => startEditing(task)} className="py-1 px-2 bg-yellow-500 text-white rounded">
                  Edit
                </button>
                <button onClick={() => deleteTask(task.id)} className="py-1 px-2 bg-red-500 text-white rounded">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
