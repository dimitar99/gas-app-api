import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateAccessToken = (payload: any) => {
    return jwt.sign(payload, process.env['JWT_SECRET'] as string, { expiresIn: '1h' });
}

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, process.env['JWT_SECRET'] as string);
}

export const generateRefreshToken = (payload: any) => {
    return jwt.sign(payload, process.env['JWT_REFRESH_SECRET'] as string, { expiresIn: '7d' });
}

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, process.env['JWT_REFRESH_SECRET'] as string);
}

export const hashToken = (token: string) =>
    crypto.createHash('sha256').update(token).digest('hex');