const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/postRoutes");

require("dotenv").config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',  // Replace this with your frontend URL if deployed
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,  // Allow credentials (cookies)
  };

app.use(express.json());
app.use(cors(corsOptions));

// routes
app.use("/", authRoutes);
app.use("/posts", postRoutes);  // base path


sequelize.sync().then(() => {
    console.log("PostgreSQL database synced");
    app.listen(5000, () => console.log("Server running on port 5000"));
});
