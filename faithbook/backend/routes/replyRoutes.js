const express = require("express");
const Reply = require("../models/Reply");
const User = require("../models/User");
const UserSpecific = require("../models/UserSpecific");

require("dotenv").config();
const authenticate = require("../middleware/authenticateToken"); // Middleware to check JWT

const router = express.Router();

// create new reply
router.post("/create", authenticate, async (req, res) => {
    try {
        const userId = req.user.id; // extracted from token
        const { postId, content } = req.body;

        if (!postId || !userId || !content) {
            return res.status(400).json({ message: "Required data is missing" });
        }
        const reply = await Reply.create({ userId, postId, content });
        return res.status(201).json(reply);

    } catch (err) {
        return res.status(500).json({ message: "Failed to create reply" });
    }
});

// Get all replies of Post
router.get("/:postId", async (req, res) => {
    const { postId } = req.params;
    try {
        const replies = await Reply.findAll({
            where: { postId },
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

module.exports = router;

