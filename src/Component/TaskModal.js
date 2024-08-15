import React, { useState } from 'react';
import Modal from 'react-modal';

// Set the root element for accessibility
Modal.setAppElement('#root');

function TaskModal({ isOpen, onRequestClose, onAddTask }) {
  const [task, setTask] = useState('');

  const handleAddTask = () => {
    if (task.trim() !== '') {
      onAddTask(task);
      setTask('');
      onRequestClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Task Modal"
      className="flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Add New Task</h2>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task"
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Task
          </button>
          <button
            onClick={onRequestClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default TaskModal;
