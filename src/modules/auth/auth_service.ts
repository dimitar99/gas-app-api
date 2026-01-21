import { UserModel } from "./user_model.js";
import * as jwt from "../../shared/utils/jwt.js";
import { RefreshTokenModel } from "./refresh_token_model.js";

export const register = async (email: string, password: string) => {
    const exists = await UserModel.findOne({ email });
    if (exists) throw new Error('Email already used');

    const user = await UserModel.create({ email, password });
    return user;
}

export const login = async (email: string, password: string) => {
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) throw new Error('Invalid credentials');

    const valid = await user.comparePassword(password);
    if (!valid) throw new Error('Invalid credentials');

    const accessToken = jwt.generateAccessToken({ userId: user.id });
    const refreshToken = jwt.generateRefreshToken({ userId: user.id });

    await RefreshTokenModel.create({
        user: user.id,
        tokenHash: jwt.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
};

export const refresh = (refreshToken: string) => {
    const payload: any = jwt.verifyRefreshToken(refreshToken);

    return {
        accessToken: jwt.generateAccessToken(payload.userId),
    };
};