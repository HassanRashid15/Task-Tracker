import React from 'react';

function Task({ task, onComplete, isCompleted }) {
  return (
    <div style={{ marginBottom: '10px', textDecoration: isCompleted ? 'line-through' : 'none' }}>
        <div>
      <p>{task.text}</p>
      </div>
      <button onClick={() => onComplete(task.id)}> {isCompleted ? '' : 'Complete'}</button>
    </div>
  );
}

export default Task;
