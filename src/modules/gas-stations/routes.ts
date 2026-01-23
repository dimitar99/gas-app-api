import { Router } from "express";
import * as controller from "./controller.js";

const router = Router();

router.get('/near-by', controller.getNearbyGasStationsController);

export default router;
