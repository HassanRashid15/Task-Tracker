import React from 'react';

function Task({ task, onComplete, isCompleted }) {
  return (
    <div style={{ marginBottom: '10px', textDecoration: isCompleted ? 'line-through' : 'none' }}>
      <p>{task.text}</p>
      <p>Created: {task.createdDate}</p>
      {isCompleted && <p>Completed: {task.completedDate}</p>}
      <button onClick={() => onComplete(task.id)}>
        {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
      </button>
    </div>
  );
}

export default Task;
