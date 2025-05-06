const express = require('express');
const router = express.Router();
const { getBooks, createBook, updateBook, deleteBook, verifyToken } = require('../Controllers/bookController');
router.get('/getAll', verifyToken, getBooks);
router.post('/create', verifyToken, createBook);
router.put('/:id',  updateBook);
router.delete('/:id',verifyToken,  deleteBook);

module.exports = router;
