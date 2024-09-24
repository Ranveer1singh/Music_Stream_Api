const multer = require("multer")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports= {upload}
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
