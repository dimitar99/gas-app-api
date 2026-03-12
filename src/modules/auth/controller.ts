import type { Request, Response } from "express";
import * as service from "./service.js";

export const register = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'No request body' });
        }

        const { email, password, fuel, tankSize } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        if (fuel && !['gasoline95', 'gasoline98', 'dieselA', 'dieselB', 'adblue', 'gnc', 'glp'].includes(fuel)) {
            return res.status(400).json({ message: 'Invalid fuel type' });
        }

        if (tankSize && tankSize < 0) {
            return res.status(400).json({ message: 'Invalid tank size' });
        }

        try {
            const resp = await service.register(email, password, fuel, tankSize);
            return res.status(201).json(resp);
        } catch (error) {
            if (error instanceof Error && error.message === 'Email already used') {
                return res.status(400).json({ message: 'Email already used' });
            }
            console.error('❌ Error registering user', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
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
            const resp = await service.login(email, password);
            return res.status(200).json(resp);
        } catch (error) {
            console.error('❌ Error logging in', error);
            return res.status(401).json({ message: 'Invalid credentials' });
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
            console.error('❌ Error verifying refresh token - Invalid refresh token', error);
            return res.status(401).json({ message: 'Invalid refresh token' });
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

        try {
            await service.logout(refreshToken);
            return res.json({ message: 'Logged out' });
        } catch (error) {
            console.error('❌ Error logging out - Invalid refresh token', error);
            return res.status(400).json({ message: 'Invalid refresh token' });
        }
    } catch (error) {
        console.error('❌ Error logging out', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}