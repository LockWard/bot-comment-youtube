import express from 'express';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';

import authRoutes from './routes/auth.js';
import { PORT } from './config/config.js';
import './passport/google.js';

async function server() {
    const app = express();

    // Configure session middleware
    app.use(session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
    }));

    app.use(passport.initialize());// Middlewares
    app.use(passport.session());
    app.use(bodyParser.json());

    app.use('/api/auth', authRoutes);// Routes

    try {

        app.listen(PORT, () => console.log(`Running on Port ${PORT}`));

    } catch (err) {

        console.log(err);
        
    }
}

server();