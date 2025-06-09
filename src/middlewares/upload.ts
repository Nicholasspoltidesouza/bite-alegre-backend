import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

export const uploadRestaurantUpdate = upload.fields([
  { name: 'menuMedias', maxCount: 10 },
  { name: 'profilePhoto', maxCount: 1 },
]);
