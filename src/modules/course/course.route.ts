import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidation } from './course.validation';
import { CoursesControllers } from './course.controller';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CourseValidation.createCourseValidationSchema),
  CoursesControllers.createCourse,
);

router.get('/get-all', CoursesControllers.getAllCourses);

router.get('/:courseId', CoursesControllers.getSingleCourse);

router.delete('/:courseId', CoursesControllers.deleteCourse);

export const CourseRouter = router;
