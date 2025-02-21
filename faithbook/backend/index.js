const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/postRoutes");

require("dotenv").config();

const app = express();

const corsOptions = {
    origin: (origin, callback) => {
      // Allow the localhost URL and your production URL also github ios
    
      const allowedOrigins = ['http://localhost:5173', 
      'https://faithbook.site/', 
      'https://escapeuw.github.io/faithbook',
      'https://dhwang.dev/faithbook'];
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);  // Origin is allowed
      } else {
        callback(new Error('Not allowed by CORS'));  // Block the request if the origin is not in the allowed list
      }
    },
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,  // Allow credentials (cookies, authentication)
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
