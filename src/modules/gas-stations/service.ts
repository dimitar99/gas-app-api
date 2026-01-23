import axios from "axios";
import { mapExternalToGasStation } from "./mapper.js";
import { GasStationModel } from "./model.js";

export const syncGasStations = async () => {
    const resp = await axios.get('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/');

    const gasStations = resp.data.ListaEESSPrecio;

    const parsedGasStations = gasStations.map((gasStation: any) => {
        return mapExternalToGasStation(gasStation);
    });

    await GasStationModel.deleteMany();

    await GasStationModel.insertMany(parsedGasStations);
}

export const getNearbyGasStations = async (latitude: number, longitude: number, kms: number) => {
    return await GasStationModel.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [latitude, longitude],
                },
                $maxDistance: kms * 1000,
            },
        },
    });
}