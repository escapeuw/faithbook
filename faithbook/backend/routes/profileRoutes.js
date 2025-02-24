const express = require("express");
const { upload, uploadFileToS3 } = require("../middleware/upload"); // Update path if needed
const { UserSpecific } = require("../models"); // Import your Sequelize models
const authenticate = require("../middleware/authenticateToken"); // Ensure you have authentication middleware
const router = express.Router();

router.post("/upload-profile-picture", authenticate, upload.single("profilePicture"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const userId = req.user.id; // Get authenticated user ID
        const imageUrl = await uploadFileToS3(req.file, userId); // Upload image to S3

        // Update the user's profile picture in the database
        await UserSpecific.update({ profilePic: imageUrl }, { where: { userId } });

        res.json({ success: true, imageUrl });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ success: false, message: "Upload failed" });
    }
});

module.exports = router;
