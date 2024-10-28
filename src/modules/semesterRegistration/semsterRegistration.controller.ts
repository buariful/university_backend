import httpStatus from 'http-status';
import sendResponse from '../../app/utils/sendResponse';
import { SemsterRegistrationService } from './semesterRegistration.service';
import { RequestHandler } from 'express';
import catchAsync from '../../app/utils/catchAsync';

const createSemesterRegistration: RequestHandler = catchAsync(
  async (req, res) => {
    const result =
      await SemsterRegistrationService.createSemesterRegistrationIntoDB(
        req.body,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester registration created successfully',
      data: result,
    });
  },
);

const getAllSemesterRegistrations: RequestHandler = catchAsync(
  async (req, res) => {
    const result =
      await SemsterRegistrationService.getAllSemesterRegistrationFromDB(
        req.query,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester registrations are retrived successfully',
      data: result,
    });
  },
);
const getSingleSemesterRegistrations: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result =
      await SemsterRegistrationService.getSingleSemesterRegistrationFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester registration is retrived successfully',
      data: result,
    });
  },
);

export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistrations,
};
