const express = require("express");
const { Op } = require("sequelize");
const Post = require("../models/Post");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// Create a new Post
router.post("/create", async (req, res) => {
    try {
        const { userId, devotion, imageUrl, bibleVerse } = req.body;


        if (!userId || !content) {
            return res.status(400).json({ error: "User ID and content are required"});
        }

        const post = await Post.create({ userId, devotion, imageUrl, bibleVerse });
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: "Failer to create post" });
    }
});


// Get all Posts
router.get("/", async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: { model: User, attributes: ["username"] }, 
            order: [["createdAt", "DESC"]], // sort by latest
            limit: 30, // Get only the top 30 posts
        });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch posts"});
    }
});

/// if I add profile pic

/* const posts = await Post.findAll({
    include: [
        {
            model: User,
            attributes: ["username"],
            include: {
                model: UserProfile, 
                attributes: ["profilePicture"] // Fetch profile picture from UserProfile model
            }
        }
    ],
    order: [["createdAt", "DESC"]],
}); */

module.exports = router;
