import { Router } from 'express';
import multer from 'multer';
import { uploadPdf, getSources, ingestWebsite, ingestGithub } from '../controllers/sourceController';
import { authMiddleware } from '../middleware/authMiddleware';
import path from 'path';
import fs from 'fs';

const router = Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Routes
// Protect all source routes
router.use(authMiddleware);

router.get('/', getSources);
router.post('/website', ingestWebsite);
router.post('/github', ingestGithub);
// Request `multipart/form-data` containing key `file`
router.post('/pdf', upload.single('file'), uploadPdf);

export default router;
