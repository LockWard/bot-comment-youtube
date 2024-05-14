import express from 'express';
import passport from 'passport';
import authRoutes from './routes/auth.js';

import { PORT } from './config/config.js';
import './strategies/google';

async function server() {
    const app = express();

    app.use(passport.initialize());// Middlewares

    app.use('/api/auth', authRoutes);// Routes

    try {

        app.listen(PORT, () => console.log(`Running on Port ${PORT}`));

    } catch (err) {

        console.log(err);
        
    }
}

server();