import type { Request, Response } from "express";
import { syncGasStations } from "./service.js";
import { getNearbyGasStations } from "./service.js";
import type { GasStationDocument } from "./model.js";

export const syncGasStationsController = async (_req: Request, res: Response) => {
    try {
        await syncGasStations();

        return res.status(200).json({ message: 'Gas stations synced successfully' });
    } catch (error) {
        console.error('❌ Error getting gas stations', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const getNearbyGasStationsController = async (req: Request, res: Response) => {
    try {
        const lat = Number(req.query["lat"]);
        const lng = Number(req.query["lng"]);
        const kms = Number(req.query["kms"]);

        if (!lat || !lng || !kms) {
            return res.status(400).json({
                message: 'lat, lng and kms query params are required',
            });
        }

        const gasStations = await getNearbyGasStations(lat, lng, kms);

        if (gasStations.length === 0) {
            return res.status(404).json({ message: 'No gas stations found' });
        }

        const user = req.user;

        if (!user?.fuel) {
            return res.status(404).json({ message: 'User not found' });
        }

        const fuelType = user.fuel as keyof GasStationDocument['prices'];
        const sortedByPrice = gasStations.sort((a, b) => {
            const priceA = Number(a.prices[fuelType]) || Infinity;
            const priceB = Number(b.prices[fuelType]) || Infinity;
            return priceA - priceB;
        });

        return res.json(sortedByPrice);

    } catch (error) {
        console.error('❌ Error getting gas stations', error);
        return res.status(404).json({ message: 'No gas stations found' });
    }
}