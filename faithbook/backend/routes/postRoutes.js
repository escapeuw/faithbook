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
        return res.status(201).json(post);
    } catch (err) {
        return res.status(500).json({ error: "Failed to create post" });
    }
});


// Get all Posts
router.get("/", async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ["username", "title", "id"],
                    include: {
                        model: UserSpecific,
                        attributes: ["profilePic"]
                    }
                }],
            order: [["createdAt", "DESC"]], // sort by latest
            limit: 30, // Get only the top 30 posts
        });

        const postsWithLikes = await Promise.all(posts.map(async (post) => {
            // Find the likes for each post (limit to 2 users as per your original request)
            const likes = await Like.findAll({
                where: { postId: post.id },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username'],
                        include: {
                            model: UserSpecific,
                            attributes: ["profilePic"]
                        }
                    }
                ],
                order: [["createdAt", "DESC"]],
                limit: 2
            });

            const usersWhoLiked = likes.map(like => {
                return {
                    id: like.User.id,
                    username: like.User.username,
                    profilePicture: like.User.UserSpecific.profilePic
                };
            });

            const totalLikes = post.likes;  // Assuming you have a likes field in Post model

            return {
                post,
                usersWhoLiked,
                othersCount: totalLikes - usersWhoLiked.length // Count how many more people liked the post
            };
        }));


        return res.json(postsWithLikes);
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch posts" });
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
        return res.json(posts);
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch posts" });
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
router.post('/like-status', authenticate, async (req, res) => {
    const userId = req.user.id; // Decoding the JWT token on the server to get user ID
    const { postIds } = req.body;

    try {
        const likeStatuses = await Like.findAll({
            where: { postId: postIds, userId },
            attributes: ["postId"]
        });

        return res.json(likeStatuses || []);

    } catch (error) {
        console.error('Error fetching like status:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});


// editing a post
router.put('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // requestd user is not the post owner
        if (post.userId !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        post.content = content || post.content;
        await post.save();

        return res.json({ message: 'Post updated successfully', post });
    } catch (error) {
        return res.status(500).json({ message: "Error updating post", error });
    }
});

// deleting a post
router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // requestd user is not the post owner
        if (post.userId !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await post.destroy();
        return res.status(200).json({ message: "Post deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Error deleting post", error });
    }
});

module.exports = router;
