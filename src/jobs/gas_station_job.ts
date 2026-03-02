import cron from 'node-cron';
import { syncGasStations } from '../modules/gas-stations/service.js';

export const startGasStationsJob = () => {
    const runSync = async () => {
        console.log('⛽ Sync gas stations started');

        try {
            await syncGasStations();
            console.log('⛽ Sync gas stations finished');
        } catch (error) {
            console.error('⛽ Sync gas stations failed', error);
        }
    };

    // Run immediately on startup
    runSync();

    // Schedule cron
    cron.schedule('*/30 * * * *', runSync);
}