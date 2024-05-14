"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOOGLE_REDIRECT_URL = exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.PORT = process.env.PORT || 3000;
exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
exports.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
exports.GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
