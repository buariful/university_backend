import sendResponse from '../../app/utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../app/utils/catchAsync';
import { AcademicSemesterService } from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterService.createAcademicSemesterIntoDB(
    req.body,
  );

  sendResponse(res, {
    success: true,
    message: 'Academic Semester is created successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
};
