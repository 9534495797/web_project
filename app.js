const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Sample user data stored in memory (replace with database)
const users = [
    { id: 1, username: 'user1', password: '$2b$10$MDgFgksGat4tLq8CHMTStugA3MUvA2jvYUQJiexJAp6JRhMRB3ouW' } // Password: password
];

// Passport setup
passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username);
    if (!user) return done(null, false, { message: 'Incorrect username' });
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) return done(err);
        if (!result) return done(null, false, { message: 'Incorrect password' });
        return done(null, user);
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

// Routes
app.get('/', (req, res) => {
    res.send('<h1>Welcome to Passport Authentication Example</h1><a href="/login">Login</a> | <a href="/register">Register</a>');
});

app.get('/login', (req, res) => {
    res.send(`
        <h2>Login</h2>
        <form action="/login" method="post">
            <input type="text" name="username" placeholder="Username" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit">Login</button>
        </form>
        <a href="/register">Don't have an account? Register here</a>
    `);
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', (req, res) => {
    res.send(`
        <h2>Register</h2>
        <form action="/register" method="post">
            <input type="text" name="username" placeholder="Username" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit">Register</button>
        </form>
        <a href="/login">Already have an account? Login here</a>
    `);
});

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = { id: users.length + 1, username: req.body.username, password: hashedPassword };
        users.push(newUser);
        res.redirect('/login');
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

app.get('/profile', isAuthenticated, (req, res) => {
    res.send(`<h2>Welcome, ${req.user.username}!</h2><a href="/logout">Logout</a>`);
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
