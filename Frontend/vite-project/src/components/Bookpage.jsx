import React, { useState, useEffect } from 'react';
import './Bookpage.css';
import axios from 'axios';
import { useAuth } from '../context/authContext.jsx';
import { useNavigate } from 'react-router-dom';

const BookPage = () => {
  const { authToken } = useAuth();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const navigate = useNavigate();

  // Fetch all books from the API
  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/books/getAll', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log("Books API response:", response.data);

      // Check if the response is in the expected format
      let bookList = [];

      if (Array.isArray(response.data)) {

        bookList = response.data;
      } else if (Array.isArray(response.data.books)) {

        bookList = response.data.books;
      } else {
        throw new Error('Unexpected response structure');
      }

      setBooks(bookList);
      setError('');
    } catch (err) {
      console.error('Error fetching books:', err);
      setBooks([]);
    }
  };

  useEffect(() => {
    if (authToken) fetchBooks();
  }, [authToken]);

  const handleDelete = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5000/books/${bookId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete book.');
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!title || !author) {
      setError('Please enter both title and author.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/books/create',
        { title, author },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setBooks((prevBooks) => [...prevBooks, response.data]);
      setTitle('');
      setAuthor('');
      setError('');
    } catch (err) {
      console.error('Add book error:', err);
    }
  };

  return (
    <div className="book-page">
      <h1>Books</h1>
      <h2>Available Books:</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {Array.isArray(books) && books.length === 0 ? (
        <p>No books found in the database.</p>
      ) : (
        Array.isArray(books) && books.length > 0 ? (
          <ul>
            {books.map((book, i) => (
              <div key={i} className="book-item">
                <p><strong>Title:</strong> {book.title}</p>
                <p><strong>Author:</strong> {book.author}</p>
                <button onClick={() => handleDelete(book.id)}>Delete</button>
              </div>
            ))}
          </ul>
        ) : (
          <p>Loading...</p> 
        )
      )}

      <h3>Add a New Book</h3>
      <form onSubmit={handleAddBook}>
        <input
          type="text"
          placeholder="Book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default BookPage;
