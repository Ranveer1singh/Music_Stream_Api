const multer = require("multer")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const multerHandler = (fieldName) => {
    return (req, res, next) => {
        // Use the appropriate multer method (array, single, etc.)
        const uploadInstance = upload.array(fieldName);

        // Call the multer instance and handle errors
        uploadInstance(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // Handle field name mismatch error
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({
                        error: `Field name mismatch. Expected field: ${fieldName}`
                    });
                }
            } else if (err) {
                // Handle any other errors
                return res.status(500).json({
                    error: 'An error occurred during the file upload.'
                });
            }
            // Continue to the next middleware if no error
            next();
        });
    };
};

module.exports = { multerHandler };
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1000000 }, // 1MB limit
//     fileFilter: (req, file, cb) => {
//       if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//       } else {
//         cb(new Error('Not an image! Please upload an image.'), false);
//       }
//     }
//   });
