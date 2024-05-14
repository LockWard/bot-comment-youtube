import { Router, Request, Response } from 'express';
import passport from 'passport';

const router: Router = Router();

router.get('/google', passport.authenticate('google'), (_req: Request, res: Response) =>
    res.send(200)
);

router.get('/google/redirect', passport.authenticate('google'), (_req: Request, res: Response) =>
    res.send(200)
);

export default router;