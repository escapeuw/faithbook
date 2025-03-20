const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/postRoutes");
const replyRoutes = require("./routes/replyRoutes");
const profileRoutes = require('./routes/profileRoutes');
const bibleRoutes = require("./routes/bibleRoutes");


require("dotenv").config();

const app = express();

app.use((req, res, next) => {
    console.log("Request protocol:", req.headers["x-forwarded-proto"]);
    if (req.headers["x-forwarded-proto"] !== "https" && process.env.NODE_ENV === "production") {
        return res.redirect(301, "https://" + req.headers.host + req.url);
    }
    next();
});

// Dynamic origin check
const corsOptions = {
    origin: (origin, callback) => {
        // Allow the localhost URL and your production URL also github ios

        const allowedOrigins = [
            'http://localhost:5173',
            'https://faithbook.site',
            'https://escapeuw.github.io/faithbook',
            'https://dhwang.dev/faithbook',
            'https://www.faithbook.site'];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);  // Allow request
        } else {
            console.error("Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,POST,PUT,DELETE,OPTIONS",  // ✅ Add OPTIONS for preflight
    credentials: true,  // ✅ Allow credentials (cookies, authentication)
    allowedHeaders: "Content-Type,Authorization"  // ✅ Allow headers
};


app.use(cors(corsOptions));
app.use(express.json());


// ✅ Explicitly Handle Preflight (`OPTIONS`) Requests
app.options("*", (req, res) => {
    res.set("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.set("Access-Control-Allow-Credentials", "true");
    res.status(204).end();  // ✅ Respond with 204 No Content (prevents 500 error)
});


// routes
app.use("/", authRoutes);
app.use("/posts", postRoutes);  // base path
app.use("/reply", replyRoutes);
app.use("/profile", profileRoutes);
app.use("/verse", bibleRoutes);

// it handles react routes on refresh
const path = require("path");

// Serve static files from the React frontend
app.use(express.static(path.join(__dirname, "../dist"))); // Adjust to "build" if using CRA

// Catch-all handler for React Router
app.get("*", (req, res) => {
    console.log(`Serving index.html for: ${req.url}`);
    res.sendFile(path.join(__dirname, "../dist", "index.html"));  // Adjust path based on your frontend build
});


sequelize.sync().then(() => {
    console.log("PostgreSQL database synced");
    app.listen(5000, () => console.log("Server running on port 5000"));
});
