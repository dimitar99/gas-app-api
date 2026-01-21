import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { app } from './app.js';

const startServer = async () => {
    try {
        mongoose.connect(process.env['MONGO_URI'] as string)
            .then(() => console.log('✅ MongoDB connected'))
            .catch(err => console.error('❌ Mongo error', err));

        app.listen(process.env['PORT'], () => {
            console.log(`🚀 Server running on port ${process.env['PORT']}`);
        });
    } catch (error) {
        console.error('❌ Error starting server', error);
        process.exit(1);
    }
}

startServer();