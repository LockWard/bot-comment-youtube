import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import authRoutes from './routes/auth.js';
import { PORT } from './config/config.js';

async function server() {
    const app = express();

    // Middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(helmet());
    app.use(cors());
    app.use(cookieParser());

    // app.use(bodyParser.json());

    // Setting up Views
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    app.use('/', authRoutes);// Routes

    try {

        app.listen(PORT, () => console.log(`Running on Port ${PORT}`));

    } catch (err) {

        console.log(err);

    }
}

server();