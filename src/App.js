import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { addTask, filterTasks, setTasks, setSearchQuery } from "./taskSlice";
import Task from "./components/Task";
import "./App.css";
import {  ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
const App = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => {
    const filter = state.tasks.filter;
    const searchQuery = state.tasks.searchQuery.toLowerCase();
    const allTasks = state.tasks.tasks;

    // Filter tasks based on filter type
    const filteredTasks = (() => {
      switch (filter) {
        case "Completed":
          return allTasks.filter((task) => task.completed);
        case "Pending":
          return allTasks.filter(
            (task) =>
              !task.completed && new Date(task.dueDate) >= new Date()
          );
        case "Overdue":
          return allTasks.filter(
            (task) =>
              !task.completed && new Date(task.dueDate) < new Date()
          );
        default:
          return allTasks; // "All" tasks
      }
    })();

    // Further filter tasks based on search query
    return filteredTasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery)
    );
  });

  const filter = useSelector((state) => state.tasks.filter);

  const [newTask, setNewTask] = React.useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const handleAddTask = () => {
    if (newTask.title.trim() === "" || newTask.dueDate.trim() === "") {
      toast.info("Please fill in all required fields.");
      return;
    }
    dispatch(addTask(newTask));
    setNewTask({ title: "", description: "", dueDate: "" });
  };

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const moveTask = (dragIndex, hoverIndex) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(dragIndex, 1);
    updatedTasks.splice(hoverIndex, 0, movedTask);
    dispatch(setTasks(updatedTasks));
  };

  return (
    <>
  <ToastContainer />
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 py-4 px-2 sm:px-6 lg:px-8">
        <div className="max-w-full mx-auto bg-white shadow-lg rounded-lg p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {/* Left Side: Task Form */}
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Task Management</h1>

            {/* Add Task Section */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Task Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddTask}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                Add Task
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search tasks..."
                onChange={handleSearch}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Right Side: Task Listing */}
          <div className="space-y-6 overflow-auto">
            {/* Filters */}
            <div className="flex justify-start  mb-6 flex-wrap gap-3">
              {["All", "Completed", "Pending", "Overdue"].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => dispatch(filterTasks(filterOption))}
                  className={`px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-lg font-medium ${
                    filter === filterOption
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  } hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {filterOption}
                </button>
              ))}
            </div>

            {/* Task List */}
            <ul className="space-y-6 max-h-[60vh] overflow-y-auto">
              {tasks.map((task, index) => (
                <Task key={task.id} task={task} index={index} moveTask={moveTask} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DndProvider>
    </>
  );
};

export default App;
