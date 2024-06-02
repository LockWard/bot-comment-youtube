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

router.get('/', (_req: Request, res: Response) => {
    res.redirect('login');
});

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

// function youtube_parser(url: string) {

// let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
// let match = url.match(regExp);

// if (match && match[2].length == 11) {
//     return match[2];
// } else {
//     throw error;
// }
// }

router.post('/comment', async (req: Request, res: Response) => {

    const { videoId, text } = req.body;

    if (!videoId || !text) {
        return res.status(400).send('videoId and text are required');
    }

    // Ensure videoId and text are arrays
    // const videoIds = Array.isArray(videoId) ? videoId : [videoId];
    // const texts = Array.isArray(text) ? text : [text];

    try {
        const youtube = google.youtube({
            version: 'v3',
            auth: oauth2Client,
        });

        const url = videoId.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        const urlParser = (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];

        // const urlParser = youtube_parser(videoId);

        await youtube.commentThreads.insert({
            part: ['snippet'],
            requestBody: {
                snippet: {
                    videoId: urlParser,
                    topLevelComment: {
                        snippet: {
                            textOriginal: text,
                        },
                    },
                },
            },
        });

        // await Promise.all(videoIds.map((id, index) => {
        //     return youtube.commentThreads.insert({
        //         part: ['snippet'],
        //         requestBody: {
        //             snippet: {
        //                 videoId: id,
        //                 topLevelComment: {
        //                     snippet: {
        //                         textOriginal: texts[index],
        //                     },
        //                 },
        //             },
        //         },
        //     });
        // }));

        return res.render('success', { message: 'Comment inserted successfully!' });
        // return res.redirect('/comment');


    } catch (error) {

        console.error('Error inserting comment:', error);
        return res.status(500).render('error', { message: 'Error inserting comment. ' + error });

    }
});

router.get('/logout', (_req: Request, res: Response) => {

    oauth2Client.revokeCredentials((err) => {
        if (err) {

            console.error('Error logging out:', err);
            return res.render('error', { message: 'Error logging out.' });

        }

        oauth2Client.setCredentials({});
        return res.redirect('/login');

    });
});

export default router;