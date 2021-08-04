import express, {Request, Response} from 'express';
import * as userController from '../controllers/user';
const router = express.Router();

router.post('/', userController.addUser);
router.post('/login', userController.loginUser);
router.get('/', userController.allusers);
router.get('/:identifier', userController.getUserByIdentifier);
router.delete('/:id', userController.deleteUser);
router.patch('/:id', userController.updateUser);

export {router as userRouter}