const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map(o => o.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { success: false, message: "Too many requests. Slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth", authLimiter, require("./src/routes/auth.routes"));
app.use("/api/mpesa", apiLimiter, require("./src/routes/mpesa.routes"));
app.use("/api/events", require("./src/routes/event.routes"));
app.use("/api/sermons", require("./src/routes/sermon.routes"));
app.use("/api/gallery", require("./src/routes/gallery.routes"));
app.use("/api/contact", require("./src/routes/contact.routes"));
app.use("/api/analytics", require("./src/routes/analytics.routes"));
app.use("/api/announcements", require("./src/routes/announcement.routes"));
app.use("/api/newsletter", require("./src/routes/newsletter.routes"));
app.use("/api/prayer-requests", require("./src/routes/prayerrequest.routes"));
app.use("/api/bible-studies", require("./src/routes/biblestudy.routes"));
app.use("/api/settings", require("./src/routes/sitesettings.routes"));
app.use("/api/logs", require("./src/routes/activitylog.routes"));
app.use("/api/users", require("./src/routes/user.routes"));
app.use("/api/import", require("./src/routes/autoimport.routes"));
app.use("/api/blog", require("./src/routes/blogpost.routes"));
app.use("/api/bulletin", require("./src/routes/bulletin.routes"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Sabbathtarian Church API is running" });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
    const { startScheduler } = require("./src/utils/scheduler");
    startScheduler();
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error("MongoDB error:", err.message);
    process.exit(1);
  });
