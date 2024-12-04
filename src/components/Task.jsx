import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { deleteTask, toggleComplete, editTask } from "../taskSlice";

const Task = ({ task, index, moveTask }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const [, dragRef] = useDrag({
    type: "TASK",
    item: { index },
  });

  const [, dropRef] = useDrop({
    accept: "TASK",
    hover: (item) => {
      if (item.index !== index) {
        moveTask(item.index, index);
        item.index = index;
      }
    },
  });

  const handleEdit = () => {
    dispatch(editTask(editedTask));
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
  };

  return (
    <li
      ref={(node) => dragRef(dropRef(node))}
      className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 w-fit"
    >
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) =>
              setEditedTask({ ...editedTask, title: e.target.value })
            }
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={editedTask.description}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <input
            type="date"
            value={editedTask.dueDate}
            onChange={(e) =>
              setEditedTask({ ...editedTask, dueDate: e.target.value })
            }
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleEdit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>
          <p className="text-gray-600">{task.description}</p>
          <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
          <div className="mt-4 space-x-3">
            <button
              onClick={() => dispatch(toggleComplete(task.id))}
              className={`py-2 px-4 rounded-lg ${
                task.completed
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {task.completed ? "Completed" : "Mark as Complete"}
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default Task;
