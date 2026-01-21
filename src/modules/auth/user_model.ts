import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends Document {
    email: string;
    password: string;
    createdAt: Date;
    isActive: boolean;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    return next;
})

userSchema.methods['comparePassword'] = function (
    password: string
): Promise<boolean> {
    return bcrypt.compare(password, this['password']);
};

export const UserModel = model<UserDocument>('User', userSchema);
