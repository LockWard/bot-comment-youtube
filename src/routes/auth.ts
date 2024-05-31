import { Router, Request, Response } from 'express';
import { google } from 'googleapis';

import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL,
    SCOPES
} from '../config/config';

const router: Router = Router();

const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL
);

router.get('/login', (_req: Request, res: Response) => {

    const authUrl = oauth2Client.generateAuthUrl({

        access_type: 'offline',
        scope: SCOPES

    });

    return res.render("index", { authUrl: authUrl });

});

router.get('/redirect', async (req: Request, res: Response) => {

    const code = req.query.code as string;

    try {

        if (req.query.error) {
            // The user did not give us permission.
            return res.redirect('/');
        } else {
            
            const { tokens } = await oauth2Client.getToken(code);

            // Store tokens securely
            oauth2Client.setCredentials(tokens);

            return res.render('success', { message: 'Authentication successful!' });

        }
    } catch (error) {

        console.error('Error authenticating:', error);
        return res.status(500).render('error', { message: 'Error authenticating.' });

    }
});

router.get('/comment', (_req: Request, res: Response) => {
    res.render('comment');
});

router.post('/comment', async (req: Request, res: Response) => {
    
    const { videoId, text } = req.body;

    if (!videoId || !text) {
        return res.status(400).send('videoId and text are required');
    }

    try {
        const youtube = google.youtube({
            version: 'v3',
            auth: oauth2Client,
        });

        await youtube.commentThreads.insert({
            part: ['snippet'],
            requestBody: {
                snippet: {
                    videoId: videoId,
                    topLevelComment: {
                        snippet: {
                            textOriginal: text,
                        },
                    },
                },
            },
        });

        // return res.render('comment', response.data);
        return res.render('success', { message: 'Comment inserted successfully!' });

    } catch (error) {

        console.error('Error inserting comment:', error);
        return res.status(500).render('error', { message: 'Error inserting comment.' });
        
    }
});

router.get('/logout', (_req: Request, res: Response) => {

    oauth2Client.revokeCredentials((err) => {
        if (err) {

            console.error('Error logging out:', err);
            return res.render('error', { message: 'Error logging out.' });

        }

        oauth2Client.setCredentials({});
        return res.render('success', { message: 'Logout successful!' });

    });
});

// router.get('/*', (_req, _res, next: NextFunction) => {
//     setTimeout(() => {
//         try {

//             throw new Error('BROKEN');

//         } catch (err) {

//             next(err);

//         }
//     }, 100);
// });

export default router;