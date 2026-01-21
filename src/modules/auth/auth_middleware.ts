import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "./user_model.js";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    const auth = req.headers.authorization;
    if (!auth) return res.sendStatus(401);

    try {
        const token = auth.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as { userId: string };
        const user = await UserModel.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};