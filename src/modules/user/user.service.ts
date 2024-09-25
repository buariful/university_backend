import httpStatus from 'http-status';
import config from '../../app/config';
import AppError from '../../app/Errors/AppError';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';

import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/stuedent.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import mongoose from 'mongoose';

const createStuentIntoDB = async (password: string, payload: TStudent) => {
  // checking if student exists with same email
  const findStudentWithSameEmail = await Student.find({ email: payload.email });
  if (findStudentWithSameEmail?.length) {
    throw new Error('Student with this email already exists');
  }

  // create a user object
  const userData: Partial<TUser> = {};
  // if password is not given, use default password.
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';

  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );
  if (!admissionSemester) {
    // throw new Error('Admission semester not found');
    throw new AppError(httpStatus.NOT_FOUND, 'Admission semester is not found');
  }

  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );
  if (!academicDepartment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic department is not found',
    );
  }

  /* 
  ==================================
    TRANSACTION AND ROLLBACK
  ==================================
  */
  const session = await mongoose.startSession();

  try {
    // starting the transaction
    session.startTransaction();

    //  set generated id
    userData.id = await generateStudentId(admissionSemester);

    //  create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    // create a stuent
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    //  set id, _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // creating a student (transaction-2)
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    // committing and ending  the transaction
    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (error) {
    // aborting and ending the transaction.
    await session.abortTransaction();
    await session.endSession();
  }
};

export const UserServices = {
  createStuentIntoDB,
};
