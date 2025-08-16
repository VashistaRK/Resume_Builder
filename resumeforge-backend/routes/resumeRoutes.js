import express from 'express';
// import { protect } from '../middleware/authMiddleware.js';
import { CreateResume, deleteResume, getResumeById, getUserResumes, updateResume } from '../controllers/resumeController.js';
// import { uploadResumeImages } from '../controllers/uploadImages.js';
import { requireAuth } from '../middleware/clerkAuthMiddleware.js';



const resumeRouter = express.Router()
resumeRouter.post('/',requireAuth,CreateResume)
resumeRouter.get('/',requireAuth, getUserResumes)
resumeRouter.get('/:id', requireAuth, getResumeById)

resumeRouter.put('/:id',requireAuth, updateResume)
// resumeRouter.put('/:id/upload-images', requireAuth, uploadResumeImages)

resumeRouter.delete('/:id', requireAuth, deleteResume)

export default resumeRouter;