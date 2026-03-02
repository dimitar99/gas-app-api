import { Router } from "express";
import * as controller from "./controller.js";
import { authenticate } from "../auth/middleware.js";

const router = Router();

router.put('/', authenticate, controller.updatePreferences);

export default router;
