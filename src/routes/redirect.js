import express from "express";
const router = express.Router();

import redirectController from "../controllers/redirectController.js";

router.get("/:id", redirectController.redirect);

export default router;
