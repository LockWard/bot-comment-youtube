import { config } from 'dotenv';
config();

export const PORT = process.env.PORT || 3000;
const baseURL = `http://localhost:${PORT}/api`;

// The secret for the encryption of the jsonwebtoken
export const JWTsecret = process.env.JWTsecret || '';

// The credentials and information for OAuth2
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;

export const redirect_URIS = [`${baseURL}/auth/redirect`];

export const SCOPES = [
    // 'email',
    // 'profile',
    // 'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/youtube.readonly',
];


