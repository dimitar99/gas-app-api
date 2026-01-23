import { Schema, model } from 'mongoose';

export interface GasStationDocument {
    name: string;
    schedule: string;
    prices: {
        gasoline95?: number;
        gasoline98?: number;
        dieselA?: number;
        dieselB?: number;
        adblue?: number;
        gnc?: number;
        glp?: number;
    };
    province: string;
    city: string;
    address: string;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
}

const schema = new Schema<GasStationDocument>(
    {
        name: { type: String, required: true },
        schedule: String,

        prices: {
            gasoline95: Number,
            gasoline98: Number,
            dieselA: Number,
            dieselB: Number,
            adblue: Number,
            gnc: Number,
            glp: Number,
        },

        province: String,
        city: String,
        address: String,

        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
    },
    { timestamps: true }
);

schema.index({ location: '2dsphere' });

export const GasStationModel = model<GasStationDocument>(
    'GasStation',
    schema
)