// controllers/uploadController.js
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// AWS S3 configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

/**
 * Uploads a base64 image to S3 and returns the image URL
 * @param {string} base64Image - base64 encoded image string
 * @returns {Promise<string>} - S3 public image URL
 */
const uploadBase64ToS3 = async (base64Image) => {
  if (!base64Image) throw new Error("No image provided");

  const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid base64 string");

  const mimeType = matches[1];
  const imageData = Buffer.from(matches[2], "base64");
  const extension = mimeType.split("/")[1];
  const key = `${uuidv4()}.${extension}`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: imageData,
    ContentEncoding: "base64",
    ContentType: mimeType,
    ACL: "public-read", // optional if public access needed
  };

  const result = await s3.upload(uploadParams).promise();
  return result.Location; // S3 URL
};

module.exports = { uploadBase64ToS3 };
