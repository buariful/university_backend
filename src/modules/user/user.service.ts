import config from '../../app/config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/stuedent.model';
import { TUser } from './user.interface';
import { User } from './user.model';

const createStuentIntoDB = async (password: string, studentData: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};
  // if password is not given, use default password.
  userData.password = password || (config.default_password as string);

  //  set manually generated id
  userData.id = '2030100002';

  //set student role
  userData.role = 'student';

  //  create an user
  const newUser = await User.create(userData);

  // create a stuent
  if (Object.keys(newUser).length) {
    //  set id, _id as user
    studentData.id = newUser.id;
    studentData.user = newUser._id; //reference _id

    const newStudent = await Student.create(studentData);
    return newStudent;
  }
  return 'abc';
};

export const UserServices = {
  createStuentIntoDB,
};
