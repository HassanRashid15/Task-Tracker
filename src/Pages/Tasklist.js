import React, { useState, useEffect } from 'react';
import { MdFilterList } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import TaskModal from './../Component/TaskModal';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Load tasks from local storage on component mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text) => {
    const newTask = { id: Date.now(), text, isCompleted: true };
    setTasks([...tasks, newTask]);
  };

  const updateTaskStatus = (id, status) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isCompleted: status === 'Completed' } : task
    ));
  };

  // Filter tasks based on the selected filter
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
            className="flex items-center px-4 py-2 bg-black text-white rounded focus:outline-none focus:ring-2 "
          >
            <FaPlus className="lg:mr-2 text-lg" />
            <span className="hidden md:inline">Add Task</span>
          </button>
        </div>
      </div>
      <div className="relative mb-6 flex items-center">
        <button
          onClick={toggleDropdown}
          className="flex items-center px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 "
        >
          <MdFilterList className="text-gray-600" />
          <span className="hidden md:inline ml-2">{filter}</span>
        </button>
        {isDropdownOpen && (
          <ul className="absolute top-full bg-white border border-gray-300 rounded shadow-lg z-10">
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
          </ul>
        )}
      </div>
      <TaskModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        onAddTask={addTask}
      />
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col">
              <div className={`flex-1 ${task.isCompleted ? 'text-gray-700' : 'text-gray-700 line-through'}`}>
                {task.text}
              </div>
              <button
                onClick={() => updateTaskStatus(task.id, task.isCompleted ? 'Incomplete' : 'Completed')}
                className={`mt-4 px-4 py-2 rounded focus:outline-none ${
                  task.isCompleted ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {task.isCompleted ? 'Complete' : 'Incomplete'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-4">
          No tasks assigned yet.
        </div>
      )}
    </div>
  );
}

export default TaskList;
