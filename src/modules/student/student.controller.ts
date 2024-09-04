import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StudentServices } from './student.service';

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

const getStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudents();

  res.status(200).json({
    success: true,
    message: 'All students',
    data: result,
  });
});

const getSingleStudent: RequestHandler = async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudent(studentId);

    res.status(200).json({
      success: true,
      message: 'Student retrived successfully',
      data: result,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    res.status(400).json({
      success: false,
      message: 'Something went wrong.',
    });
  }
};

export const StudentControllers = {
  getStudents,
  getSingleStudent,
};
