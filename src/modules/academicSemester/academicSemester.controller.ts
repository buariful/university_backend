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

const getAllAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterService.getAllAcademicSemester();

  sendResponse(res, {
    success: true,
    message: 'All academic semesters',
    statusCode: httpStatus.OK,
    data: result,
  });
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AcademicSemesterService.getSingleAcademicSemester(id);

  sendResponse(res, {
    success: true,
    message: 'Academic semester',
    statusCode: httpStatus.OK,
    data: result,
  });
});

const updateAcademicSemester = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AcademicSemesterService.updateAcademicSemester(
    id,
    req.body,
  );

  sendResponse(res, {
    success: true,
    message: 'Academic semester updated successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
