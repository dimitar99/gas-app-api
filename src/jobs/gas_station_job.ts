import cron from 'node-cron';
import { syncGasStations } from '../modules/gas-stations/service.js';

export const startGasStationsJob = () => {
    cron.schedule('*/30 * * * *', async () => {
        console.log('⛽ Sync gas stations started');

        try {
            await syncGasStations();
            console.log('⛽ Sync gas stations finished');
        } catch (error) {
            console.error('⛽ Sync gas stations failed', error);
        }
    });
}