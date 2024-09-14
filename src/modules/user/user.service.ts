import config from '../../app/config';

import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/stuedent.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

const createStuentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};
  // if password is not given, use default password.
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';

  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  //  set manually generated id
  userData.id = await generateStudentId(admissionSemester);

  //  create an user
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
