const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export async function fetchBooks() {
  const res = await fetch(`${API}/books`);
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

export async function createBook(book) {
  const res = await fetch(`${API}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateBook(id, book) {
  const res = await fetch(`${API}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteBook(id) {
  const res = await fetch(`${API}/books/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
  return res.json();
}
