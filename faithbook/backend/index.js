const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
require("dotenv").config();

const app = express();
app.use(express.static(path.join(__dirname, "build")));
app.use(cors());

// ✅ Handle React client-side routing (SPA behavior)
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
  
  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// routes
app.use("/api/auth", authRoutes);


sequelize.sync().then(() => {
    console.log("PostgreSQL database synced");
    app.listen(5000, () => console.log("Server running on port 5000"));
});
