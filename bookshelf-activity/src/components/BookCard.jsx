import React, { useState } from 'react';
import '../TodoList.css';

export default function BookCard({ todo, onMarkCompleted, onDelete, onRemoveFromCompleted, filter, onViewDetails, onEdit }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMark = () => {
    onMarkCompleted && onMarkCompleted(todo.id);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    onDelete && onDelete(todo.id);
    setMenuOpen(false);
  };

  const handleEdit = () => {
    onEdit && onEdit(todo);
    setMenuOpen(false);
  };

  return (
    <div className={`book-card ${todo.completed ? 'completed' : ''}`} onMouseLeave={() => setMenuOpen(false)}>
      <img
        src={todo.image || process.env.PUBLIC_URL + '/no-image.jpg'}
        alt={todo.text}
        className="book-cover"
        onClick={() => onViewDetails && onViewDetails(todo)}
        style={{ cursor: 'pointer' }}
      />
      <div className="book-info">
        <h3 onClick={() => onViewDetails && onViewDetails(todo)} style={{ cursor: 'pointer' }}>{todo.text}</h3>
        <p>{todo.category || 'Fiction'}</p>
      </div>

      <div className="ellipsis-container">
        <button className="ellipsis-btn" onClick={() => setMenuOpen(!menuOpen)}>...</button>
        {menuOpen && (
          <div className="ellipsis-menu">
            {!todo.completed && <button onClick={handleMark}>Mark as Completed</button>}
            {todo.completed && <button onClick={() => { onRemoveFromCompleted && onRemoveFromCompleted(todo.id); setMenuOpen(false); }}>Mark as Incomplete</button>}
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}
