import React, { useState, useEffect } from 'react';
import { MdFilterList } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import TaskModal from './../Component/TaskModal';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    try {
      console.log('Loading tasks from local storage...');
      const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      setTasks(storedTasks);
    } catch (error) {
      console.error("Failed to load tasks from local storage", error);
    }
  }, []);

  useEffect(() => {
    try {
      console.log('Saving tasks to local storage...');
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to local storage", error);
    }
  }, [tasks]);

  const addTask = (text) => {
    const newTask = { id: Date.now(), text, isCompleted: false, createdDate: new Date().toLocaleString(), completedDate: null };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };
  

  const updateTaskStatus = (id, status) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? { ...task, isCompleted: status === 'Completed', completedDate: status === 'Completed' ? new Date().toLocaleString() : null }
          : task
      )
    );
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return task.isCompleted;
    if (filter === 'Incomplete') return !task.isCompleted;
    return true;
  });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setIsDropdownOpen(false);
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
        </AnimatePresence>
      </div>
      <TaskModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        onAddTask={addTask}
      />
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
          {filteredTasks.map((task) => (
  <motion.div
    key={task.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col transition-transform duration-300"
  >
    <div className="flex-1">
      <p className={`text-gray-700 ${task.isCompleted ? 'line-through' : ''}`}>
        {task.text}
      </p>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: task.isCompleted ? 0 : 1, height: task.isCompleted ? 0 : 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ opacity: { duration: 0.3 }, height: { duration: 0.3, ease: "easeInOut" }}}
        className="text-sm text-gray-500 overflow-hidden"
      >
        Created: {task.createdDate}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: task.isCompleted ? 1 : 0, height: task.isCompleted ? 'auto' : 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ opacity: { duration: 0.3 }, height: { duration: 0.3, ease: "easeInOut" }}}
        className="text-sm text-gray-500 overflow-hidden"
      >
        Completed: {task.completedDate}
      </motion.div>
    </div>
    <button
      onClick={() => updateTaskStatus(task.id, task.isCompleted ? 'Incomplete' : 'Completed')}
      className={`mt-4 px-4 py-2 rounded focus:outline-none ${
        task.isCompleted ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'
      }`}
    >
      {task.isCompleted ? 'Incomplete' : 'Complete'}
    </button>
  </motion.div>
))}




          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-4">
          {filter === 'Completed' ? 'No completed tasks available.' : filter === 'Incomplete' ? 'No incomplete tasks available.' : 'No tasks assigned yet.'}
        </div>
      )}
    </div>
  );
}

export default TaskList;
