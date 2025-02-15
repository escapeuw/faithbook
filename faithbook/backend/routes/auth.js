const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
    console.log("TESTING !!:", req.body);
    try {
        const { username, email, password, confirmPassword, title } = req.body;

        // Check if user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // check passwords
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({ username, email, password: hashedPassword, title });
       
        res.json({ message: "User registered successfully", user: newUser });
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
        if (!user) return res.status(400).json({ message: "Invalid crentials" });

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


module.exports = router;