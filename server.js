const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'appointment_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test DB connection
pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to MySQL database.');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to MySQL:', err.message);
    });

// --- Routes d'Authentification ---

// Inscription
app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully.', userId: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists.' });
        }
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// Connexion
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const [rows] = await pool.execute(
            'SELECT id, password FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Email or password incorrect.' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email or password incorrect.' });
        }

        // Simplification: Retourne l'ID utilisateur pour le frontend
        res.json({ message: 'Login successful.', userId: user.id });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// --- Routes de Gestion des Rendez-vous (Placeholder) ---

// Middleware pour vérifier l'authentification (simplifié)
const authenticateToken = async (req, res, next) => {
    // Dans une application réelle, on utiliserait un JWT. Ici, on simule avec un header.
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.sendStatus(401); // Unauthorized
    }
    req.userId = userId;
    next();
};

// Récupérer les rendez-vous de l'utilisateur
app.get('/api/appointments', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM appointments WHERE user_id = ? ORDER BY start_time',
            [req.userId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Server error fetching appointments.' });
    }
});

// Créer un nouveau rendez-vous
app.post('/api/appointments', authenticateToken, async (req, res) => {
    const { title, start_time, end_time } = req.body;

    if (!title || !start_time || !end_time) {
        return res.status(400).json({ message: 'Title, start_time, and end_time are required.' });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO appointments (user_id, title, start_time, end_time) VALUES (?, ?, ?, ?)',
            [req.userId, title, start_time, end_time]
        );
        res.status(201).json({ message: 'Appointment created successfully.', appointmentId: result.insertId });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Server error creating appointment.' });
    }
});


// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
