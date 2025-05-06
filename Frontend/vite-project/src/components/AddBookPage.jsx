import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext.jsx';
import { useNavigate } from 'react-router-dom';

const AddBookPage = () => {
  const { authToken } = useAuth();
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    description: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const createBook = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/books/create',
        bookData,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log('Book created successfully:', response.data);
      navigate('/'); // Navigate back to the books page after creation
    } catch (error) {
      console.error('Error creating book:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data : 'An error occurred');
    }
  };

  return (
    <div>
      <h1>Add New Book</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createBook();
        }}
      >
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={bookData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            type="text"
            name="author"
            value={bookData.author}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={bookData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Create Book</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddBookPage;
