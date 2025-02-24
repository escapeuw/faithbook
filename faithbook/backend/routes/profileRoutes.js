const express = require('express');
const upload = require('../middleware/upload'); // The multer S3 middleware
const authenticate = require('../middleware/authenticateToken'); // Auth middleware
const UserSpecific = require('../models/UserSpecific');

const router = express.Router();

router.post('/upload-profile-picture', authenticate, upload.single('profilePicture'),
    async (req, res) => {
        try {
            const userId = req.user.id; // Now req.user is defined
            const imageUrl = req.file.location; // S3 returns the URL

            await UserSpecific.update({ profilePic: imageUrl }, { where: { userId } });

            res.json({ success: true, imageUrl });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Upload failed' });
        }
    });

module.exports = router;
