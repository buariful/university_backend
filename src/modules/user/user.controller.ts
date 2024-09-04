import { RequestHandler } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../app/utils/sendResponse';
import httpStatus from 'http-status';

const createStudent: RequestHandler = async (req, res, next) => {
  try {
    const { password, student } = req.body;

    const result = await UserServices.createStuentIntoDB(password, student);

    // res.status(201).json({
    //   success: true,
    //   message: 'Student is created successfully',
    //   data: result,
    // });

    sendResponse(res, {
      success: true,
      message: 'Student is created successfully',
      statusCode: httpStatus.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserControllers = {
  createStudent,
};
