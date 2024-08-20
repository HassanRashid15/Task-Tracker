import React, { useState, useEffect, useRef } from 'react';
import { MdFilterList, MdSort, MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import TaskModal from './../Component/TaskModal';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('Newest');

  const filterButtonRef = useRef(null);
  const sortButtonRef = useRef(null);

  const sortTasks = (tasks, order) => {
    switch (order) {
      case 'Newest':
        return [...tasks].sort((a, b) => b.id - a.id);
      case 'Oldest':
        return [...tasks].sort((a, b) => a.id - b.id);
      case 'A-Z':
        return [...tasks].sort((a, b) => a.text.localeCompare(b.text));
      case 'Z-A':
        return [...tasks].sort((a, b) => b.text.localeCompare(a.text));
      default:
        return tasks;
    }
  };

  const filteredAndSortedTasks = sortTasks(
    tasks.filter(task => {
      if (filter === 'All') return true;
      if (filter === 'Completed') return task.isCompleted;
      if (filter === 'Incomplete') return !task.isCompleted;
      return true;
    }),
    sortOrder
  );

  useEffect(() => {
    try {
      const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      setTasks(storedTasks);
    } catch (error) {
      console.error("Failed to load tasks from local storage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to local storage", error);
    }
  }, [tasks]);

  const addTask = (text) => {
    const newTask = { id: Date.now(), text, isCompleted: false };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const updateTaskStatus = (id, status) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, isCompleted: status === 'Completed' } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const deleteAllTasks = () => {
    setTasks([]);
  };

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
    if (isSortDropdownOpen) {
      setIsSortDropdownOpen(false);
    }
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
    if (isFilterDropdownOpen) {
      setIsFilterDropdownOpen(false);
    }
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setIsFilterDropdownOpen(false);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    setIsSortDropdownOpen(false);
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

      <div className="relative mb-6 flex items-center space-x-4">
        <button
          ref={filterButtonRef}
          onClick={toggleFilterDropdown}
          className="flex items-center px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1"
        >
          <MdFilterList className="text-gray-600" />
          <span className="hidden md:inline ml-2">{filter}</span>
        </button>

        <button
          ref={sortButtonRef}
          onClick={toggleSortDropdown}
          className="flex items-center px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1"
        >
          <MdSort className="text-gray-600" />
          <span className="hidden md:inline ml-2">{sortOrder}</span>
        </button>

        <AnimatePresence>
          {isFilterDropdownOpen && (
            <motion.ul
              className="absolute filter-dropdown bg-white border border-gray-300 rounded shadow-lg z-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ top: filterButtonRef.current?.offsetHeight, left: 0 }}
            >
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleFilterChange('All')}
              >
                All Tasks
              </li>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleFilterChange('Completed')}
              >
                Completed Tasks
              </li>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleFilterChange('Incomplete')}
              >
                Incomplete Tasks
              </li>
            </motion.ul>
          )}

          {isSortDropdownOpen && (
            <motion.ul
              className="absolute sorting-dropdown bg-white border border-gray-300 rounded shadow-lg z-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                top: sortButtonRef.current?.offsetHeight,
                left: sortButtonRef.current?.offsetLeft
              }}
            >
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSortChange('Newest')}
              >
                Newest
              </li>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSortChange('Oldest')}
              >
                Oldest
              </li>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSortChange('A-Z')}
              >
                A-Z
              </li>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSortChange('Z-A')}
              >
                Z-A
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {tasks.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={deleteAllTasks}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete All Tasks
          </button>
        </div>
      )}

      <TaskModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        onAddTask={addTask}
      />

      {filteredAndSortedTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAndSortedTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col"
              >
                <div className={`flex-1 ${task.isCompleted ? 'text-gray-700 line-through' : 'text-gray-700'}`}>
                  {task.text}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => updateTaskStatus(task.id, task.isCompleted ? 'Incomplete' : 'Completed')}
                    className={`px-4 py-2 rounded focus:outline-none ${
                      task.isCompleted ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {task.isCompleted ? 'Incomplete' : 'Complete'}
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-4 py-2 flex items-center"
                    aria-label="Delete task"
                  >
                    <MdDelete className="text-red-500 text-2xl ml-2" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-4">No tasks found</div>
      )}
    </div>
  );
}

export default TaskList;
