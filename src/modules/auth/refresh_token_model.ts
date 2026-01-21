import { Schema, model, Types } from 'mongoose';

export interface RefreshTokenDocument {
    user: Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
    createdAt: Date;
}

const schema = new Schema<RefreshTokenDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        tokenHash: {
            type: String,
            required: true,
            unique: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 },
        },
    },
    { timestamps: true }
)

export const RefreshTokenModel = model<RefreshTokenDocument>(
    'RefreshToken',
    schema
);