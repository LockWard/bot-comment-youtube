import { Router, Request, Response } from 'express';
import passport from 'passport';

const router: Router = Router();

router.get('/google', passport.authenticate('google'), (_req: Request, res: Response) =>
    res.send(200)
);

router.get('/google/redirect', passport.authenticate('google'), (_req: Request, res: Response) =>
    res.send(200)
);

router.post('/google', (req: Request, res: Response) => {
    const accessToken = req.body.accessToken;
    console.log('Received access token:', accessToken);

    res.send('Access token received by the backend');
});

export default router;