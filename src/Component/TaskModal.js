import React, { useState } from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';

Modal.setAppElement('#root');

function TaskModal({ isOpen, onRequestClose, onAddTask }) {
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [hours, setHours] = useState('12');
  const [minutes, setMinutes] = useState('00');
  const [amPm, setAmPm] = useState('AM');

  const handleAddTask = () => {
    if (task.trim() !== '' && dueDate) {
      // Construct the due date string including time and AM/PM
      const formattedDueDate = `${new Date(dueDate).toLocaleDateString('en-US')} ${hours}:${minutes} ${amPm}`;
      onAddTask(task, formattedDueDate);
      setTask('');
      setDueDate('');
      setHours('12');
      setMinutes('00');
      setAmPm('AM');
      onRequestClose();
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Task Modal"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          width: '300px',
          borderRadius: '8px',
        },
      }}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h2 className="text-2xl font-semibold mb-4">Add New Task</h2>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="date"
          value={dueDate.split('T')[0]} // Extract date part
          onChange={(e) => setDueDate(`${e.target.value}T${dueDate.split('T')[1] || '00:00'}`)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <div className="flex items-center mb-4">
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value.padStart(2, '0'))}
            min="1"
            max="12"
            className="w-16 p-2 border border-gray-300 rounded mr-2"
            placeholder="HH"
          />
          <span className="mr-2">:</span>
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value.padStart(2, '0'))}
            min="00"
            max="59"
            className="w-16 p-2 border border-gray-300 rounded mr-2"
            placeholder="MM"
          />
          <select
            value={amPm}
            onChange={(e) => setAmPm(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Task
          </button>
          <button
            onClick={onRequestClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </motion.div>
    </Modal>
  );
}

export default TaskModal;
