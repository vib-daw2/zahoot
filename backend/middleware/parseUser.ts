import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtPayload } from '../types/jwtPayload';

const parseUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        next();
    } else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            req.user = decoded as jwtPayload; 
            next();
        } catch (err) {
            next();
        }
    }
};

export default parseUserMiddleware;
