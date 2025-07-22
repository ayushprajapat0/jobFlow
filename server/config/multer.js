import multer from "multer";

// Use memory storage for direct Cloudinary upload
const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Error handling middleware for multer
export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.json({ success: false, message: `File upload error: ${err.message}` });
    }
    next(err);
};

export default upload;