import { RequestHandler } from 'express';
import { StudentServices } from './student.service';
import catchAsync from '../../app/utils/catchAsync';

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

const deleteStudent: RequestHandler = async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.deleteStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
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

const updateStudent: RequestHandler = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { student } = req.body;
    const { name, guardian, localGuardian, ...remainingData } = student;
    const modifiedStudentData = { ...remainingData };

    if (name && Object.keys(name).length) {
      for (const [key, value] of Object.entries(name)) {
        modifiedStudentData[`name.${key}`] = value;
      }
    }

    if (guardian && Object.keys(guardian).length) {
      for (const [key, value] of Object.entries(guardian)) {
        modifiedStudentData[`guardian.${key}`] = value;
      }
    }

    if (localGuardian && Object.keys(localGuardian).length) {
      for (const [key, value] of Object.entries(localGuardian)) {
        modifiedStudentData[`localGuardian.${key}`] = value;
      }
    }
    const result = await StudentServices.updateStudentIntoDB(
      studentId,
      modifiedStudentData,
    );

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
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
  deleteStudent,
  updateStudent,
};
