import { UserDocument } from "../modules/auth/user_model";

declare global {
    namespace Express {
        interface Request {
            user?: UserDocument;
        }
    }
}
