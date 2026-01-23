import type { Request, Response } from "express";
import * as service from "./service.js";

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
            const tokens = await service.login(email, password);
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

        try {
            const tokens = await service.refresh(refreshToken);
            return res.json(tokens);
        } catch (error) {
            console.error('❌ Error verifying refresh token', error);
            return res.status(400).json({ message: 'Invalid refresh token' });
        }
    } catch (error) {
        console.error('❌ Error refreshing token', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'No request body' });
        }

        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        await service.logout(refreshToken);
        return res.json({ message: 'Logged out' });
    } catch (error) {
        console.error('❌ Error logging out', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}