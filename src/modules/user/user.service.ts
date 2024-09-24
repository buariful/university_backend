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

  //  set manually generated id
  userData.id = await generateStudentId(admissionSemester);

  //  create a user
  const newUser = await User.create(userData);

  // create a stuent
  if (Object.keys(newUser).length) {
    //  set id, _id as user
    payload.id = newUser.id;
    payload.user = newUser._id; //reference _id

    const newStudent = await Student.create(payload);
    return newStudent;
  } else {
    throw new Error('Failed to create student.');
  }
};

export const UserServices = {
  createStuentIntoDB,
};
