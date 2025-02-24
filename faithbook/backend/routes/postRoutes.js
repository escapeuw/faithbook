const express = require("express");
const { Op } = require("sequelize");
const Post = require("../models/Post");
const User = require("../models/User");
const Like = require("../models/Like");
const UserSpecific = require("../models/UserSpecific");

require("dotenv").config();
const authenticate = require("../middleware/authenticateToken"); // Middleware to check JWT

const router = express.Router();

// Create a new Post
router.post("/create", async (req, res) => {
    try {
        const { userId, content, imageUrl, bibleVerse } = req.body;


        if (!userId || !content) {
            return res.status(400).json({ error: "User ID and content are required" });
        }

        const post = await Post.create({ userId, content, imageUrl, bibleVerse });
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: "Failer to create post" });
    }
});


// Get all Posts
router.get("/", async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ["username", "title"],
                    include: {
                        model: UserSpecific,
                        attributes: ["profilePic"]
                    }
                }],
            order: [["createdAt", "DESC"]], // sort by latest
            limit: 30, // Get only the top 30 posts
        });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

// Get all posts of User
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const posts = await Post.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    attributes: ["username", "title"],
                    include: {
                        model: UserSpecific,
                        attributes: ["profilePic", "bio", "currentCity", "friendsCount"]
                    }
                }],
            order: [["createdAt", "DESC"]]
        });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch posts" });
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

// toggle Like/Unlike a Post
router.post('/:id/like', authenticate, async (req, res) => {
    try {
        const userId = req.user.id; // Retrieved from JWT in authenticate middleware
        const postId = req.params.id;

        // Ensure the post exists
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if this user has already liked the post
        const existingLike = await Like.findOne({ where: { userId, postId } });

        if (existingLike) {
            await Like.destroy({ where: { userId, postId } });

            await Post.decrement('likes', { by: 1, where: { id: postId } });

            // Fetch the updated post
            const updatedPost = await Post.findByPk(postId);

            return res.status(200).json({
                success: true,
                message: "Post unliked",
                likes: updatedPost.likes // Correctly return updated like count
            });

        } else {
            // Create the like record
            await Like.create({ userId, postId });

            // Atomically increment the "likes" field in the Post model
            await Post.increment('likes', { by: 1, where: { id: postId } });

            // Fetch the updated post
            const updatedPost = await Post.findByPk(postId);

            return res.status(201).json({
                success: true,
                message: 'Post liked',
                likes: updatedPost.likes
            });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});



// checking like-status
router.get('/:id/like-status', authenticate, async (req, res) => {
    const userId = req.user.id; // Decoding the JWT token on the server to get user ID
    const postId = req.params.id;

    try {
        // Check if the user has already liked this post
        const like = await Like.findOne({ where: { postId, userId } });

        if (like) {
            return res.json({ isLiked: true });
        }

        return res.json({ isLiked: false });
    } catch (error) {
        console.error('Error fetching like status:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
