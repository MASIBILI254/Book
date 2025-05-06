const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { username, password } = req.body;
  const hashed = bcrypt.hashSync(password, 8);
  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ msg: 'User registered' });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err || result.length === 0) {
      return res.status(401).send('User not found');
    }

    const valid = bcrypt.compareSync(password, result[0].password);
    if (!valid) {
      return res.status(401).send('Invalid password');
    }

   
    console.log("User object:", result[0]);

    const token = jwt.sign(

      { id: result[0].user_id },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }    
    );

    res.send({
      message: 'Login successful',
      token: token,
    });
  });
};

