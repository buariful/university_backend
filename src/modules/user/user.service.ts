import config from '../../app/config';
import { TStudent } from '../student/student.interface';
import { TUser } from './user.interface';
import { User } from './user.model';

const createStuentIntoDB = async (password: string, studentData: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password.
  userData.password = password || (config.default_password as string);

  //  set manually generated id
  userData.id = '2030100001';

  //set student role
  userData.role = 'student';

  //  create an user
  const result = await User.create(userData);

  // create a stuent
  if (Object.keys(result).length) {
    //  set id, _id as user
    studentData.id = result.id;
    studentData.user = result._id;
  }

  return result;
};

export const UserServices = {
  createStuentIntoDB,
};
