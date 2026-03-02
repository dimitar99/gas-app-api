import { UserModel } from "./user_model.js";
import * as jwt from "../../shared/utils/jwt.js";
import { RefreshTokenModel } from "./refresh_token_model.js";

export const register = async (email: string, password: string, fuel: string | null, tankSize: number | null) => {
    const exists = await UserModel.findOne({ email });
    if (exists) throw new Error('Email already used');

    var map: any = { email, password }
    if (fuel) map.fuel = fuel;
    if (tankSize) map.tankSize = tankSize;

    const user = await UserModel.create(map);

    const accessToken = jwt.generateAccessToken({ userId: user.id });
    const refreshToken = jwt.generateRefreshToken({ userId: user.id });

    await RefreshTokenModel.create({
        user: user.id,
        tokenHash: jwt.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const userWithoutPassword = await UserModel.findById(user._id).select('-password');

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: userWithoutPassword,
    };
}

export const login = async (email: string, password: string) => {
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) throw new Error('Invalid credentials');

    const valid = await user.comparePassword(password);
    if (!valid) throw new Error('Invalid credentials');

    const accessToken = jwt.generateAccessToken({ userId: user.id });
    const refreshToken = jwt.generateRefreshToken({ userId: user.id });

    // Check if user already has a refresh token
    const existingRefreshToken = await RefreshTokenModel.findOne({
        user: user.id,
    });

    if (existingRefreshToken) {
        await RefreshTokenModel.deleteOne({
            user: user.id,
        });
    }

    await RefreshTokenModel.create({
        user: user.id,
        tokenHash: jwt.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const userWithoutPassword = await UserModel.findById(user._id).select('-password');

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: userWithoutPassword,
    };
};

export const refresh = async (refreshToken: string) => {
    const payload: any = jwt.verifyRefreshToken(refreshToken);

    const exists = await RefreshTokenModel.findOne({
        user: payload.userId,
        tokenHash: jwt.hashToken(refreshToken),
    });

    if (!exists) throw new Error('Invalid refresh token');

    const accessToken = jwt.generateAccessToken({ userId: payload.userId });
    const newRefreshToken = jwt.generateRefreshToken({ userId: payload.userId });

    await RefreshTokenModel.updateOne({
        user: payload.userId,
        tokenHash: jwt.hashToken(refreshToken),
    }, {
        tokenHash: jwt.hashToken(newRefreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
        accessToken: accessToken,
        refreshToken: newRefreshToken,
    };
};

export const logout = async (refreshToken: string) => {
    const payload: any = jwt.verifyRefreshToken(refreshToken);

    const exists = await RefreshTokenModel.findOne({
        user: payload.userId,
        tokenHash: jwt.hashToken(refreshToken),
    });

    if (!exists) throw new Error('Invalid refresh token');

    await RefreshTokenModel.deleteOne({
        user: payload.userId,
        tokenHash: jwt.hashToken(refreshToken),
    });
};
