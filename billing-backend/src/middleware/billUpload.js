const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

// AWS S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Multer S3 Storage Setup
const storage = multerS3({
  s3: s3Client,
  bucket: process.env.AWS_BUCKET_NAME,
  acl: "public-read",
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    // req.body fields (categoryName, expenseDate) are available if they were appended BEFORE the file
    const dateStr = req.body.expenseDate || new Date().toISOString().split('T')[0];
    const category = (req.body.categoryName || 'General').replace(/\s+/g, '_');
    
    // Parse date for hierarchical structure
    // dateStr is typically YYYY-MM-DD
    const dateParts = dateStr.split('-');
    const year = dateParts[0] || new Date().getFullYear().toString();
    const month = dateParts[1] || (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = dateParts[2] || new Date().getDate().toString().padStart(2, '0');

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e4);
    const extension = path.extname(file.originalname);
    const originalName = path.basename(file.originalname, extension).replace(/\s+/g, '_');
    
    // Convention: billing/year/month/day/category/filename
    const fileName = `billing/${year}/${month}/${day}/${category}/${originalName}_${uniqueSuffix}${extension}`;
    console.log('Generated S3 Key:', fileName);
    cb(null, fileName);
  },
});

const billUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, PDF, and DOC are allowed."));
    }
  },
});

module.exports = billUpload;
