import React, { useState, useEffect, useRef } from 'react';
import { fetchBooks, createBook, updateBook, deleteBook } from './api/books';
import './TodoList.css';
import BookDetail from './components/BookDetail';
import BookCard from './components/BookCard';

// === MAIN COMPONENT ===
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [editId, setEditId] = useState(null);
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

  // Load books from backend
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchBooks();
        setTodos(
          (Array.isArray(data) ? data : []).map((b) => ({
            id: b.id,
            text: b.title,
            author: b.author,
            category: b.category,
            summary: b.summary,
            image: b.image,
            completed: !!b.completed,
          }))
        );
      } catch (err) {
        console.error('Failed to load books', err);
      }
    }
    load();
  }, []);

  // no-op: IDs are created by backend

  // Add/Update Book (backend)
  const handleAddBook = async () => {
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

    try {
      if (editId) {
        const updated = await updateBook(editId, {
          title: newBook.title,
          author: newBook.author,
          category: newBook.category,
          summary: newBook.summary,
          image: newBook.image,
          completed: false,
        });
        setTodos(
          todos.map((t) =>
            t.id === editId
              ? {
                  ...t,
                  text: updated.title,
                  author: updated.author,
                  category: updated.category,
                  summary: updated.summary,
                  image: updated.image,
                }
              : t
          )
        );
        setEditId(null);
      } else {
        const created = await createBook({
          title: newBook.title,
          author: newBook.author,
          category: newBook.category,
          summary: newBook.summary,
          image: newBook.image,
        });
        setTodos([
          ...todos,
          {
            id: created.id,
            text: created.title,
            author: created.author,
            category: created.category,
            summary: created.summary,
            image: created.image,
            completed: created.completed,
          },
        ]);
      }

      setNewBook(initialBookState);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setAlertMessage('Error saving book.');
      setShowAlert(true);
    }
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

 
  const deleteTodo = async (id) => {
    await deleteBook(id);
    setTodos(todos.filter((t) => t.id !== id));
  };

  const markAsCompleted = async (id) => {
    const book = todos.find((t) => t.id === id);
    if (!book) return;
    await updateBook(id, { ...book, completed: true, title: book.text });
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: true } : t)));
  };
  const removeFromCompleted = (id) => setTodos(todos.map(t => t.id === id ? { ...t, completed: false } : t));

  const handleEdit = (book) => {
    setEditId(book.id);
    setNewBook({
      title: book.text || '',
      author: book.author || '',
      category: book.category || '',
      summary: book.summary || '',
      image: book.image || ''
    });
    setShowModal(true);
  };

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
        <div className="header-center">
          <img src={process.env.PUBLIC_URL + '/ORION-transparent.png'} alt="ORION" className="header-logo" />
        </div>
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
            <BookCard
              key={todo.id}
              todo={{ ...todo, image: todo.image || process.env.PUBLIC_URL + '/no-image.jpg' }}
              onMarkCompleted={markAsCompleted}
              onDelete={deleteTodo}
              onRemoveFromCompleted={removeFromCompleted}
              filter={filter}
              onViewDetails={(b) => setSelectedBook(b)}
              onEdit={(b) => handleEdit(b)}
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

      {/* Book Detail View */}
      {selectedBook && (
        <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}

export default TodoList;
