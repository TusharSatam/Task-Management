import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  filter: "All", // Default filter
  searchQuery: "", // Search input
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        id: Date.now(),
        ...action.payload,
        completed: false,
      };
      state.tasks.push(newTask);
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    toggleComplete: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    editTask: (state, action) => {
      const { id, title, description, dueDate } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.title = title;
        task.description = description;
        task.dueDate = dueDate;
      }
    },
    filterTasks: (state, action) => {
      state.filter = action.payload;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload; // Store the search input
    },
  },
});

export const {
  addTask,
  deleteTask,
  toggleComplete,
  editTask,
  filterTasks,
  setTasks,
  setSearchQuery, // Export the new action
} = taskSlice.actions;

export default taskSlice.reducer;
