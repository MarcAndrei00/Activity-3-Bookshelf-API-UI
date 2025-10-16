import React from 'react';
import '../TodoList.css';

export default function BookDetail({ book, onClose }) {
  if (!book) return null;

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <button className="back-btn" onClick={onClose}>BACK</button>
        <h1 className="detail-title">{book.text}</h1>
        <div className="detail-body">
          <img src={book.image || process.env.PUBLIC_URL + '/no-image.jpg'} alt={book.text} className="detail-cover" />

          <div className="detail-meta">
            <div className="meta-row"><strong>AUTHOR:</strong><div className="meta-value">{book.author || 'Unknown'}</div></div>
            <div className="meta-row"><strong>CATEGORY:</strong><div className="meta-value">{book.category || 'Fiction'}</div></div>

            <div className="summary-section">
              <strong>SUMMARY:</strong>
              <p className="summary-text">{book.summary || 'No summary available.'}</p>
            </div>

            {/* extra filler to match design */}
            <p className="detail-lorem">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
