import httpStatus from 'http-status';
import sendResponse from '../../app/utils/sendResponse';
import { SemsterRegistrationService } from './semesterRegistration.service';
import { RequestHandler } from 'express';

const createSemesterRegistration: RequestHandler = async (req, res) => {
  const result =
    await SemsterRegistrationService.createSemesterRegistrationIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester registration created successfully',
    data: result,
  });
};

export const SemesterRegistrationController = {
  createSemesterRegistration,
};
