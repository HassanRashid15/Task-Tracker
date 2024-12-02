import React, { useState, useEffect } from "react";
import { MdFilterList } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import TaskModal from "./../Component/TaskModal";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Define Kanban columns
  const kanbanColumns = ["To Do", "In Progress", "In Review", "Done"];

  useEffect(() => {
    try {
      console.log("Loading tasks from local storage...");
      const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
      setTasks(storedTasks);
    } catch (error) {
      console.error("Failed to load tasks from local storage", error);
    }
  }, []);

  useEffect(() => {
    try {
      console.log("Saving tasks to local storage...");
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to local storage", error);
    }
  }, [tasks]);

  const addTask = (text, dueDate) => {
    const newTask = {
      id: Date.now(),
      text,
      status: "To Do", // Default status is "To Do"
      dueDate: new Date(dueDate).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        hour12: true,
      }),
      completedDate: null,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const filteredTasksByStatus = (status) =>
    tasks.filter((task) => task.status === status);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setIsDropdownOpen(false);
  };

  // Helper function to get the next status
  const getNextStatus = (currentStatus) => {
    const statuses = ["To Do", "In Progress", "In Review", "Done"];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    return statuses[nextIndex];
  };

  // Helper function to get the button label based on current status
  const getButtonLabel = (currentStatus) => {
    switch (currentStatus) {
      case "To Do":
        return "Start";
      case "In Progress":
        return "Process Done";
      case "In Review":
        return "Review Done";
      case "Done":
        return "Reopen";
      default:
        return "Next";
    }
  };

  return (
    <div className="tasklist-parent max-w-6xl mx-auto px-3">
      <div className="flex md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
        <div className="md:mt-0 flex items-center">
          <button
            onClick={() => setModalIsOpen(true)}
            className="flex items-center px-4 py-2 bg-black text-white rounded"
          >
            <FaPlus className="lg:mr-2 text-lg" />
            <span className="hidden md:inline">Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter Dropdown */}
      <div className="relative mb-6 flex items-center">
        <button
          onClick={toggleDropdown}
          className="flex items-center px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1"
        >
          <MdFilterList className="text-gray-600" />
          <span className="hidden md:inline ml-2">{filter}</span>
        </button>
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.ul
              className="absolute top-full bg-white border border-gray-300 rounded shadow-lg z-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleFilterChange("All")}
              >
                All Tasks
              </li>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleFilterChange("Completed")}
              >
                Completed Tasks
              </li>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleFilterChange("Incomplete")}
              >
                Incomplete Tasks
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board flex justify-between">
        {kanbanColumns.map((column) => (
          <div key={column} className="kanban-column flex flex-col w-1/4 p-4">
            <h3 className="font-semibold text-lg mb-4">{column}</h3>
            <div className="space-y-4">
              {filteredTasksByStatus(column).map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col"
                >
                  <div className="flex-1">
                    <p
                      className={`text-gray-700 ${
                        task.status === "Done" ? "line-through" : ""
                      }`}
                    >
                      {task.text}
                    </p>
                   <motion.div
  initial={{ opacity: 0, height: 0 }}
  animate={{
    opacity: 1,
    height: "auto",
  }}
  exit={{ opacity: 0, height: 0 }}
  transition={{
    opacity: { duration: 0.3 },
    height: { duration: 0.3, ease: "easeInOut" },
  }}
  className={`text-sm overflow-hidden ${
    task.status === "Done" ? "text-gray-400 line-through" : "text-gray-500"
  }`}
>
  Due: {task.dueDate}
</motion.div>
                  </div>
                  <button
                    onClick={() =>
                      updateTaskStatus(task.id, getNextStatus(task.status))
                    }
                    className={`mt-4 px-4 py-2 rounded focus:outline-none ${
                      task.status === "Done"
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {getButtonLabel(task.status)}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <TaskModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        onAddTask={addTask}
      />
    </div>
  );
}

export default TaskList;
