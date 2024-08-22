import express from 'express';
import { StudentControllers } from './student.controller';
const router = express.Router();

router.get('/', StudentControllers.getStudents);
router.post('/create', StudentControllers.createStudent);
router.get('/:studentId', StudentControllers.getSingleStudent);

export const StudentRoutes = router;
