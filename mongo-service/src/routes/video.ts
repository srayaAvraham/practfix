import express, {Request, Response} from 'express';
import * as videoController from '../controllers/video';
const router = express.Router();

router.post('/', videoController.addVideo);
router.get('/', videoController.allVideos);
router.get('/user/:userId', videoController.allVideosOfUser);
router.get('/practices/:videoId', videoController.allPracticeOfVideo);
router.get('/user/:userId/practices/:videoId', videoController.practiceOfVideoPerUser);
router.get('/:id', videoController.getVideoById);
router.delete('/:id', videoController.deleteVideo);
router.patch('/:id', videoController.updateVideo);


export {router as VideoRouter}