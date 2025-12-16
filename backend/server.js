const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// PostgreSQL config
const pgConfig = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'hhkk',
    database: 'i3306Project'
};

// Store active sessions (in production, use Redis or JWT)
const activeSessions = new Map();

// ===== LOGIN =====
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const client = new Client(pgConfig);
    
    try {
        await client.connect();
        
        const result = await client.query(
            'SELECT * FROM dbuser WHERE username=$1 AND isactive=TRUE',
            [username]
        );
        
        if (result.rows.length === 0) {
            await client.end();
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid username or inactive account' 
            });
        }
        
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        
        if (!match) {
            const attempts = user.loginattempts + 1;
            const isActive = attempts >= user.maxloginattempts ? false : true;
            
            await client.query(
                'UPDATE dbuser SET loginattempts=$1, isactive=$2 WHERE userid=$3',
                [attempts, isActive, user.userid]
            );
            
            await client.end();
            
            return res.status(401).json({ 
                success: false, 
                message: isActive 
                    ? `Wrong password. Attempt ${attempts}/${user.maxloginattempts}` 
                    : 'Account locked due to too many failed attempts'
            });
        }
        
        // Reset attempts after successful login
        await client.query(
            'UPDATE dbuser SET loginattempts=0 WHERE userid=$1',
            [user.userid]
        );
        
        await client.end();
        
        // Store session
        const sessionToken = `${username}_${Date.now()}`;
        activeSessions.set(sessionToken, {
            username: user.username,
            role: user.role,
            employeeid: user.employeeid
        });
        
        res.json({ 
            success: true, 
            username: user.username, 
            role: user.role,
            sessionToken: sessionToken
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            message: err.message 
        });
    }
});

// ===== DEVELOPER: MY TASKS (User-Specific) =====
app.post('/api/mytasks', async (req, res) => {
    const { username } = req.body;
    const client = new Client(pgConfig);
    
    try {
        await client.connect();
        
        const result = await client.query(
            'SELECT * FROM developer_mytasks WHERE username=$1',
            [username]
        );
        
        await client.end();
        res.json(result.rows);
        
    } catch (err) {
        console.error(err);
        res.status(500).json([]);
    }
});

// ===== DEVELOPER: MY ASSETS (User-Specific) =====
app.post('/api/assets', async (req, res) => {
    const { username } = req.body;
    const client = new Client(pgConfig);
    
    try {
        await client.connect();
        
        const result = await client.query(
            'SELECT * FROM developer_assets WHERE username=$1',
            [username]
        );
        
        await client.end();
        res.json(result.rows);
        
    } catch (err) {
        console.error(err);
        res.status(500).json([]);
    }
});

// ===== TESTER: MY BUG REPORTS (User-Specific) =====
app.post('/api/bugreports', async (req, res) => {
    const { username } = req.body;
    const client = new Client(pgConfig);
    
    try {
        await client.connect();
        
        const result = await client.query(
            'SELECT * FROM tester_bugreports WHERE username=$1',
            [username]
        );
        
        await client.end();
        res.json(result.rows);
        
    } catch (err) {
        console.error(err);
        res.status(500).json([]);
    }
});

// ===== ADMIN: PROJECT OVERVIEW =====
app.get('/api/adminoverview', async (req, res) => {
    const client = new Client(pgConfig);
    
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM admin_projectoverview');
        await client.end();
        res.json(result.rows);
        
    } catch (err) {
        console.error(err);
        res.status(500).json([]);
    }
});

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log(`🔥 HAMZA INTERACTIVE SERVER ONLINE`);
    console.log(`⚡ Running on http://localhost:${PORT}`);
    console.log(`🎮 Elite Mode Activated!`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n⚡ Server shutting down...');
    process.exit(0);
});