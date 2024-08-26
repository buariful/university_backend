import { Request, Response } from 'express';
import { UserServices } from './user.service';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { password, student } = req.body;

    const result = await UserServices.createStuentIntoDB(password, student);

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

export const UserControllers = {
  createStudent,
};
