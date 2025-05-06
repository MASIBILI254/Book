require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conn = require("./db")

const authRoutes = require('./Routes/authRoutes');
const bookRoutes = require('./Routes/bookRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/books', bookRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
