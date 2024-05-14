"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const config_js_1 = require("../config/config.js");
const passport_google_oauth20_1 = require("passport-google-oauth20");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: config_js_1.GOOGLE_CLIENT_ID,
    clientSecret: config_js_1.GOOGLE_CLIENT_SECRET,
    callbackURL: config_js_1.GOOGLE_REDIRECT_URL,
    scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.force-ssl',
    ],
}, async (accessToken, _refreshToken, profile, done) => {
    console.log(accessToken);
    console.log(profile);
    done(null, { username: profile.displayName });
}));
