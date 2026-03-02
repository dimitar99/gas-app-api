import type { Request, Response } from "express";

export const updatePreferences = async (req: Request, res: Response) => {
    try {
        const { fuel, tankSize, searchRadius } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.fuel = fuel;
        user.tankSize = tankSize;
        user.searchRadius = searchRadius;

        await user.save();

        return res.status(200).json({ message: 'Preferences updated successfully', user });
    } catch (error) {
        console.error('❌ Error updating preferences', error);
        return res.status(404).json({ message: 'Error updating preferences' });
    }
}