import { UserServices } from './user.service';
import sendResponse from '../../app/utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../app/utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
  const { password, student } = req.body;

  const result = await UserServices.createStuentIntoDB(password, student);

  sendResponse(res, {
    success: true,
    message: 'Student is created successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});
const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty } = req.body;

  const result = await UserServices.insertFacultyIntoDB(password, faculty);

  sendResponse(res, {
    success: true,
    message: 'Faculty is created successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createFaculty,
};
