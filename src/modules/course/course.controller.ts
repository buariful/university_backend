import httpStatus from 'http-status';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { CourseServices } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is created successfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses is retrived successfully',
    data: result,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.getSingleCourseFromDB(courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is retrived successfully',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.deleteCourseFromDB(courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is deleted successfully',
    data: result,
  });
});
// const updateAcademicFaculty = catchAsync(async (req, res) => {
//   const { facultyId } = req.params;
//   const result = await AcademicFacultyServices.updateAcademicFaculty(
//     req.body,
//     facultyId,
//   );

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Academic faculty updated',
//     data: result,
//   });
// });

export const CoursesControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  deleteCourse,
};
