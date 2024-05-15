import passport from 'passport';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL } from '../config/config.js';

import {
    Profile,
    Strategy as GoogleStrategy,
    VerifyCallback,
} from 'passport-google-oauth20';

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID!,
            clientSecret: GOOGLE_CLIENT_SECRET!,
            callbackURL: GOOGLE_REDIRECT_URL,
            scope: [
                'email',
                'profile',
                'https://www.googleapis.com/auth/youtube',
                'https://www.googleapis.com/auth/youtube.force-ssl',
            ],
        },
        async (
            accessToken: string,
            _refreshToken: string,
            profile: Profile,
            done: VerifyCallback
        ) => {
            console.log(accessToken);
            // console.log(profile);
            done(null, { username: profile.displayName });
        }
    )
);