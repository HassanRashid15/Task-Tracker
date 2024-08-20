function Task({ task, onComplete, isCompleted }) {
  return (
    <div style={{ marginBottom: '10px', textDecoration: isCompleted ? 'line-through' : 'none' }}>
      <p>{task.text}</p>
      <p>Created: {task.createdDate}</p>
      {isCompleted && <p>Completed: {task.completedDate}</p>}
      <button onClick={() => onComplete(task.id)}> {isCompleted ? 'Incomplete' : 'Complete'}</button>
    </div>
  );
}
