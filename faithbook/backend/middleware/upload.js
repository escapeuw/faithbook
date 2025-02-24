const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Multer storage configuration
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});

const uploadFileToS3 = async (file, userId) => {
  const fileName = `profile-pictures/${userId}-${uuidv4()}${path.extname(file.originalname)}`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,

  };

  try {
    await s3.send(new PutObjectCommand(params));
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (err) {
    console.error("S3 Upload Error:", err);
    throw new Error("Failed to upload image to S3");
  }
};

module.exports = { upload, uploadFileToS3 };
