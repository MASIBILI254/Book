const db = require('../db');
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token required');
  
  const tokenStr = token.split(' ')[1];

  if (!tokenStr) return res.status(403).send('Invalid token');
  
  jwt.verify(tokenStr, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Invalid token');
    console.log("Decoded token: ", decoded);
    req.userId = decoded.id;
    console.log("Decoded user ID: ", req.userId);
    next();
  });
}

  

exports.verifyToken = verifyToken;

exports.getBooks = (req, res) => {
  // Check if userId exists 
  const userId = req.userId;
  if (!userId) {
    return res.status(400).send({ message: "User ID is required." });
  }

  // Query database for books with the given user_id
  db.query('SELECT * FROM books WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error("Database error: ", err);
      return res.status(500).send({ message: "Error fetching books", error: err.message });
    }

    // If no books are found
    if (results.length === 0) {
      return res.status(200).send({ message: "No books found for this user." });
    }

    console.log("Books found: ", results); 
    res.status(200).json(results); 
  });
};


exports.createBook = (req, res) => {
  const { title, author } = req.body;
  const userId = req.userId;

  console.log("user id", userId);

  if (!userId) {
    return res.status(400).send('User not found');
  }

  
  db.query(
    'INSERT INTO books (title, author, user_id) VALUES (?, ?, ?)',
    [title, author, userId],
    (err, result) => {
      if (err) return res.status(500).send(err);

      const insertedId = result.insertId;

   
      db.query(
        'SELECT id, title, author, user_id FROM books WHERE id = ?',
        [insertedId],
        (err2, results) => {
          if (err2) return res.status(500).send(err2);
          if (results.length === 0) return res.status(404).send('Book not found');
          res.status(201).json({ msg: 'Book created', book: results[0] });
        }
      );
    }
  );
};


exports.updateBook = (req, res) => {
  const { title, author } = req.body;
  db.query('UPDATE books SET title = ?, author = ? WHERE id = ? AND user_id = ?', [title, author, req.params.id, req.userId], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ msg: 'Book updated' });
  });
};

exports.deleteBook = (req, res) => {
  const bookId = req.params.id;
  const userId = req.userId;

  db.query('DELETE FROM books WHERE id = ? AND user_id = ?', [bookId, userId], (err, result) => {
    if (err) return res.status(500).send({ error: 'Database error', details: err });

    if (result.affectedRows === 0) {
      
      return res.status(404).send({ error: 'Book not found or unauthorized' });
    }

    res.send({ msg: 'Book deleted successfully' });
  });
};

