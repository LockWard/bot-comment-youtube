"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const auth_js_1 = __importDefault(require("./routes/auth.js"));
const config_js_1 = require("./config/config.js");
require("./strategies/google");
async function server() {
    const app = (0, express_1.default)();
    app.use(passport_1.default.initialize()); // Middlewares
    app.use('/api/auth', auth_js_1.default); // Routes
    try {
        app.listen(config_js_1.PORT, () => console.log(`Running on Port ${config_js_1.PORT}`));
    }
    catch (err) {
        console.log(err);
    }
}
server();
