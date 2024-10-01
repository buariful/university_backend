// import { TStudent } from './student.interface';
import mongoose from 'mongoose';
import { Student } from './stuedent.model';
import AppError from '../../app/Errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';

// const createStudentIntoDB = async (studentData: TStudent) => {
//   // const result = await Student.create(student);
//   const student = new Student(studentData);
//   if (await student.isUserExist(studentData?.id)) {
//     throw new Error('User Already exist');
//   }
//   const result = await student.save();
//   return result;
// };

const getAllStudents = async (query: Record<string, unknown>) => {
  const queryObj = { ...query };

  let searchTerm = '';
  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];
  const searchQuery = Student.find({
    $or: studentSearchableFields?.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' }, // partial match er jonno regex
    })),
  });

  const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  excludeFields.forEach((el) => delete queryObj[el]);

  const findQuery = searchQuery
    .find(queryObj)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  let sort = '-createdAt';
  if (query.sort) {
    sort = query.sort as string;
  }
  const sortResult = findQuery.sort(sort);

  let limit = 1;
  let page = 1;
  let skip = 0;
  if (query.limit) {
    limit = Number(query.limit);
  }
  if (query.page) {
    page = Number(query.page);
    skip = (page - 1) * limit;
  }

  const skipQuery = sortResult.skip(skip);
  const limitQuery = skipQuery.limit(limit);

  let fields = '-__v';
  if (query.fields) {
    fields = (query.fields as string).split(',').join(' ');
  }

  const fieldQuery = await limitQuery.select(fields);

  return fieldQuery;
};

const getSingleStudent = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const student = await Student.find({ isDeleted: { $ne: true }, id });
  if (!student.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "Student doesn't exists");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete student');
  }
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const result = await Student.findOneAndUpdate({ id }, payload);
  return result;
};

export const StudentServices = {
  // createStudentIntoDB,
  getAllStudents,
  getSingleStudent,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
