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
    // return res.json({authUrl});

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
            // return res.redirect('/success');

        }
    } catch (error) {

        console.error('Error authenticating:', error);
        return res.status(500).render('error', { message: 'Error authenticating.' });
        // return res.status(500).redirect('/error');

    }
});

router.get('/comment', (_req: Request, res: Response) => {
    res.render('comment');
});

// Define a type for YouTube URL objects
type YouTubeUrl = {
    url: string;
    videoId: string | null;
};

// Function to parse YouTube URLs
function parseYouTubeUrls(urls: string[]): YouTubeUrl[] {
    // Regular expression to match YouTube video IDs
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    return urls.map(url => {
        const match = url.match(youtubeRegex);
        return {
            url,
            videoId: match ? match[1] : null
        };
    });
}

router.post('/comment', async (req: Request, res: Response) => {

    const { videoId, text } = req.body;

    if (!videoId || !text) {
        return res.status(400).send('videoId and text are required');
    }

    // Ensure videoId and text are arrays
    const videoIds = Array.isArray(videoId) ? videoId : [videoId];
    const texts = Array.isArray(text) ? text : [text];

    try {
        const youtube = google.youtube({
            version: 'v3',
            auth: oauth2Client,
        });

        const parsedUrls = parseYouTubeUrls(videoIds);

        const extractParsedUrl = parsedUrls.map(video => video.videoId);

        await Promise.all(extractParsedUrl.map((id, index) => {
            return youtube.commentThreads.insert({
                part: ['snippet'],
                requestBody: {
                    snippet: {
                        videoId: id,
                        topLevelComment: {
                            snippet: {
                                textOriginal: texts[index],
                            },
                        },
                    },
                },
            });
        }));

        return res.render('success', { message: 'Comment inserted successfully!' });
        // return res.send('Comment inserted successfully!');

    } catch (error) {

        console.error('Error inserting comment:', error);
        return res.status(500).render('error', { message: 'Error inserting comment. ' + error });
        // return res.status(500).send('Error inserting comments.');

    }
});

router.get('/logout', (_req: Request, res: Response) => {

    oauth2Client.revokeCredentials((err) => {
        if (err) {

            console.error('Error logging out:', err);
            return res.render('error', { message: 'Error logging out.' });
            // return res.status(500).send('Error logging out.');

        }

        oauth2Client.setCredentials({});
        return res.redirect('/login');

    });
});

export default router;