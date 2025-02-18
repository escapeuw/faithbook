const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load environment variables

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true, // Railway requires SSL
            rejectUnauthorized: false,
        },
    },
    logging: false, // True if want to see SQL queries in the console
}); 


//const User = require("../models/User");
//const Post = require("../models/Post");

// sequelize.sync({ alter: true })     // Sync db structure
   // .then(() => console.log("Database synced"))
  //  .catch(err => console.error("Sync error:", err));



sequelize.authenticate()
    .then(() => console.log("DB Connected"))
    .catch((err) => console.error("DB CONNECTION ERROR:", err));


module.exports = sequelize;



