import express from "express";
const router = express.Router();

import urlController from "../../controllers/urlController.js";

router.get("/shortUrls", urlController.getUserUrls);
router.post("/shortUrls", urlController.creatShortUrls);

export default router;
