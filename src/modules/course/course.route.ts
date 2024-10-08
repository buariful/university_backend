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

router.get('/get-one/:courseId', CoursesControllers.getSingleCourse);

router.delete('/delete/:courseId', CoursesControllers.deleteCourse);

router.patch(
  '/update/:courseId',
  validateRequest(CourseValidation.updatedCourseValidationSchema),
  CoursesControllers.updateCourseInfo,
);

router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidation.facultiesWithCourseValidationSchema),
  CoursesControllers.assignFacultiesWithCourseIntoDB,
);

router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidation.facultiesWithCourseValidationSchema),
  CoursesControllers.removeFacultiesFromCourse,
);

export const CourseRouter = router;
