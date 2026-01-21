import type { Request, Response } from "express";
import * as service from "./auth_service.js";

export const register = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'No request body' });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        try {
            await service.register(email, password);
        } catch (error) {
            if (error instanceof Error && error.message === 'Email already used') {
                return res.status(400).json({ message: 'Email already used' });
            }
            console.error('❌ Error registering user', error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        return res.status(201).json({ message: 'User created' });
    } catch (error) {
        console.error('❌ Error registering user', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'No request body' });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        try {
            console.debug('pepe')
            const tokens = await service.login(email, password);
            console.debug(tokens);
            return res.json(tokens);
        } catch (error) {
            console.error('❌ Error logging in', error);
            return res.status(500).json({ message: 'Token error' });
        }
    } catch (error) {
        console.error('❌ Error logging in', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const refresh = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'No request body' });
        }

        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        const tokens = await service.refresh(refreshToken);
        return res.json(tokens);
    } catch (error) {
        console.error('❌ Error refreshing token', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}