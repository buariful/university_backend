import { Request, Response } from 'express';
import { StudentServices } from './student.service';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student } = req.body;
    const result = await StudentServices.createStudentIntoDB(student);

    res.status(201).json({
      success: true,
      message: 'Student is created successfully',
      data: result,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};
const getStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudents();

    res.status(200).json({
      success: true,
      message: 'All students',
      data: result,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
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
  createStudent,
  getStudents,
  getSingleStudent,
};
