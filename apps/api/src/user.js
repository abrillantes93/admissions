// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// In-memory users (replace this with a real database in production)
const users = [
    { id: 1, username: 'testuser', password: '$2a$10$...' }, // hashed password
];

// Secret key for JWT signing
const SECRET_KEY = 'your-secret-key'; // Store in environment variable in production

// Register user (for demo purposes, you might want to implement more validation)
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Hash the password before saving it (use a real database in production)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { id: Date.now(), username, password: hashedPassword };
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully' });
});

// Login user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find the user by username
    const user = users.find((u) => u.username === username);

    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the stored hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ token });
});

// Protected route example (middleware for JWT validation)
router.get('/protected', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the JWT
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        // Token is valid, provide access to protected data
        res.status(200).json({ message: 'Protected data', user: decoded });
    });
});

module.exports = router;
