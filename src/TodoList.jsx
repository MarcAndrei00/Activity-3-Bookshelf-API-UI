import React, { useState, useEffect, useRef } from 'react';
import './TodoList.css';

// === Book Card ===
function TodoItem({ todo, onMarkCompleted, onDelete, onRemoveFromCompleted, filter }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={`book-card ${todo.completed ? 'completed' : ''}`} onMouseLeave={() => setMenuOpen(false)}>
      <img
        src={todo.image || process.env.PUBLIC_URL + '/no-image.jpg'}
        alt={todo.text}
        className="book-cover"
      />
      <div className="book-info">
        <h3>{todo.text}</h3>
        <p>{todo.category || 'Fiction'}</p>
      </div>

      <div className="ellipsis-container">
        <button className="ellipsis-btn" onClick={() => setMenuOpen(!menuOpen)}>⋯</button>
        {menuOpen && (
          <div className="ellipsis-menu">
            {filter === 'all' && (
              <>
                <button onClick={() => onMarkCompleted(todo.id)}>Mark as Completed</button>
                <button onClick={() => onDelete(todo.id)}>Delete</button>
              </>
            )}
            {filter === 'completed' && (
              <>
                <button onClick={() => onRemoveFromCompleted(todo.id)}>Remove</button>
                <button onClick={() => onDelete(todo.id)}>Delete</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// === MAIN COMPONENT ===
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const textareaRef = useRef(null);

  const initialBookState = { title: '', author: '', category: '', summary: '', image: '' };
  const [newBook, setNewBook] = useState(initialBookState);

  const categories = [
    'All', 'Fiction', 'Non-Fiction', 'Science & Technology', 'Literature', 'History',
    'Philosophy', 'Psychology', 'Education & Reference', 'Business & Economics',
    'Arts & Culture', 'Health & Lifestyle', 'Politics & Society', 'Language & Communication'
  ];

  // Auto-expand
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newBook.summary]);

  // Generate unique ID
  const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

  // Add Book
  const handleAddBook = () => {
    if (!newBook.title || !newBook.author || !newBook.summary) {
      setAlertMessage('⚠️ Please fill in all fields.');
      setShowAlert(true);
      return;
    }
    if (!newBook.category) {
      setAlertMessage('⚠️ Please select a category.');
      setShowAlert(true);
      return;
    }

    const bookToAdd = {
      id: generateId(),
      text: newBook.title,
      author: newBook.author,
      category: newBook.category,
      summary: newBook.summary,
      image: newBook.image || '',
      completed: false // important: ensure new book is NOT completed
    };

    setTodos([...todos, bookToAdd]);
    setNewBook(initialBookState);
    setShowModal(false);
  };

  const handleCancel = () => {
    setNewBook(initialBookState);
    setShowModal(false);
  };

  // Image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setNewBook({ ...newBook, image: imageURL });
    }
  };

 
  const markAsCompleted = (id) => setTodos(todos.map(t => t.id === id ? { ...t, completed: true } : t));
  const removeFromCompleted = (id) => setTodos(todos.map(t => t.id === id ? { ...t, completed: false } : t));
  const deleteTodo = (id) => setTodos(todos.filter(t => t.id !== id));

  // Search
  const filteredTodos = todos.filter(todo => {
    const matchesTab = filter === 'all' ? !todo.completed : todo.completed;
    const matchesCategory = selectedCategory === 'All' ? true : todo.category === selectedCategory;
    const matchesSearch =
      todo.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.author?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesCategory && matchesSearch;
  });

  return (
    <div className="todo-container">
      {/* Header */}
      <div className="header-row">
        <h1>MY BOOKSHELF</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for Title or Author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>
      </div>

      <div className="top-bar">
        <div className="tab-buttons">
          <button className={`tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>ALL BOOKS</button>
          <button className={`tab-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>COMPLETED</button>
        </div>
        <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Book</button>
      </div>

      {/* Categories */}
      <div className="categories">
        {categories.map((cat, i) => (
          <button
            key={i}
            className={`category-btn ${selectedCategory === cat ? 'active-category' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Book Grid */}
      <div className="book-grid">
        {filteredTodos.length === 0 ? (
          <p className="no-books">No books to show.</p>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={{ ...todo, image: todo.image || process.env.PUBLIC_URL + '/no-image.jpg' }}
              onMarkCompleted={markAsCompleted}
              onDelete={deleteTodo}
              onRemoveFromCompleted={removeFromCompleted}
              filter={filter}
            />
          ))
        )}
      </div>

      {/* Add Book Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content scrollable-modal">
            <h2>Add Book</h2>

            <label>TITLE:</label>
            <input placeholder="Add Title..." value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} />

            <label>AUTHOR:</label>
            <input placeholder="Add Author..." value={newBook.author} onChange={e => setNewBook({ ...newBook, author: e.target.value })} />

            <label>CATEGORY:</label>
            <div className="category-select">
              {categories.filter(c => c !== 'All').map(cat => (
                <button
                  key={cat}
                  className={`category-btn ${newBook.category === cat ? 'active-category' : ''}`}
                  onClick={() => setNewBook({ ...newBook, category: cat })}
                >
                  {cat}
                </button>
              ))}
            </div>

            <label>SUMMARY:</label>
            <textarea ref={textareaRef} placeholder="Add Summary..." value={newBook.summary} onChange={e => setNewBook({ ...newBook, summary: e.target.value })} />

            <label>PHOTO (optional):</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {newBook.image && <img src={newBook.image} alt="Preview" className="preview-image" />}

            <div className="modal-buttons">
              <button onClick={handleAddBook} className="add-book-confirm">ADD</button>
              <button onClick={handleCancel} className="cancel-book">CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert */}
      {showAlert && (
        <div className="alert-overlay">
          <div className="alert-box">
            <p>{alertMessage}</p>
            <button onClick={() => setShowAlert(false)}> OK </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoList;
