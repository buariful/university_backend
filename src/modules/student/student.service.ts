// import { TStudent } from './student.interface';
import { Student } from './stuedent.model';

// const createStudentIntoDB = async (studentData: TStudent) => {
//   // const result = await Student.create(student);
//   const student = new Student(studentData);
//   if (await student.isUserExist(studentData?.id)) {
//     throw new Error('User Already exist');
//   }
//   const result = await student.save();
//   return result;
// };

const getAllStudents = async () => {
  const result = await Student.find({})
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
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

export const StudentServices = {
  // createStudentIntoDB,
  getAllStudents,
  getSingleStudent,
};
