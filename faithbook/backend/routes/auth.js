const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const UserSpecific = require("../models/UserSpecific");
const authenticateToken = require("../middleware/authenticateToken"); // Middleware to check JWT
require("dotenv").config();

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
    console.log("TESTING !!:", req.body);
    try {
        const { username, email, password, confirmPassword, title } = req.body;

        // password validation
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        } else if (password.length < 7) {
            return res.status(400).json({ message: "Password must be a least 7 characters long" });
        } else if (password.length > 14) {
            return res.status(400).json({ message: "Password must be less than 15 characters " });
        }

        // Check if user already exists
        let existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({ username, email, password: hashedPassword, title });

        const userSpecific = await UserSpecific.create({
            userId: newUser.id, // Link the User to the UserSpecific
        });

        res.json({ message: "User registered successfully", user: newUser, userSpecific });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: "User does not exists" });

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        //  generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });

        res.json({
            token,
            username: user.username // sends username back to frontend
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user data Route

router.get("/user", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from JWT token

        // find user using Sequelize
        const user = await User.findByPk(userId, {
            attributes: ["id", "username", "email", "title", "createdAt"]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user); // Return user data
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});



module.exports = router;