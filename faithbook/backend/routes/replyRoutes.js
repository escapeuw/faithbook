const express = require("express");
const Reply = require("../models/Reply");
const User = require("../models/User");
const Post = require("../models/Post");
const UserSpecific = require("../models/UserSpecific");

require("dotenv").config();
const authenticate = require("../middleware/authenticateToken"); // Middleware to check JWT

const router = express.Router();

// create new reply
router.post("/create", authenticate, async (req, res) => {
    try {
        const userId = req.user.id; // extracted from token
        const { postId, content, parentReplyId } = req.body;

        if (!postId || !userId || !content) {
            return res.status(400).json({ message: "Required data is missing" });
        }
        const data = await Reply.create({
            userId,
            postId,
            content,
            parentReplyId: parentReplyId || null
        });

        const reply = await Reply.findOne({
            where: { id: data.id }, // Ensure we're fetching the just-created reply
            include: [
                {
                    model: User,
                    attributes: ["username", "title"], // Specify the fields you want to include
                    include: {
                        model: UserSpecific,
                        attributes: ["profilePic"] // Specify the fields you want from UserSpecific
                    }
                }
            ]
        });

        // if nested reply, increment nestedCount of parent
        if (parentReplyId) {
            await Reply.increment("nestedCount", {
                by: 1,
                where: { id: parentReplyId }
            });
        }

        await Post.increment("repliesCount", {
            by: 1,
            where: { id: postId },
        });

        return res.status(201).json(reply);

    } catch (err) {
        return res.status(500).json({ message: "Failed to create reply" });
    }
});

// Get all parent replies of Post
router.get("/:postId", async (req, res) => {
    const { postId } = req.params;
    try {
        const replies = await Reply.findAll({
            where: { postId, parentReplyId: null },
            include: [
                {
                    model: User,
                    attributes: ["username", "title"],
                    include: {
                        model: UserSpecific,
                        attributes: ["profilePic"]
                    }
                }],
            order: [["createdAt", "DESC"]]
        });
        return res.json(replies);
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch replies" });
    }
})

// Get all nested replies of Comment 
router.get("/nested/:parentReplyId", async (req, res) => {
    const { parentReplyId } = req.params;

    try {
        const nestedReplies = await Reply.findAll({
            where: { parentReplyId },
            include: [
                {
                    model: User,
                    attributes: ["username", "title"],
                    include: {
                        model: UserSpecific,
                        attributes: ["profilePic"]
                    }
                }],
            order: [["createdAt", "ASC"]]
        });

        res.json(nestedReplies);
    } catch (error) {
        console.error("Error fetching nested replies:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;

