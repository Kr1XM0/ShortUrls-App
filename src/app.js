import express from "express";
import cookieParse from "cookie-parser";
import cron from "node-cron";

import deleteExpiredShortUrls from "./utils/deleteExpiredUrls.js";
import userAuth from "./middleware/auth.js";

import apiRoutes from "./routes/api/urls.js";
import redirectRoutes from "./routes/redirect.js";

const app = express();

// MIDELWARES
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParse());
// CREATE COOKIES USERS
app.use(userAuth);

// GET ANDO POST TO API/SHORTURLS
app.use("/api", apiRoutes);
// REDIRECT SHORTURLS
app.use("/", redirectRoutes);

cron.schedule(
  "0 0 * * * *",
  () => {
    try {
      deleteExpiredShortUrls();
    } catch (error) {
      console.error("Error deleting expired URLs:", error);
    }
  },
  {
    scheduled: true,
    timezone: "America/New_York",
  },
);

export default app;
