import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

export const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastStudent?.id ? lastStudent?.id : undefined;
};

export const generateStudentId = async (payload: TAcademicSemester) => {
  // first time 0000
  let currentId = (0).toString();
  const lastStudentId = await findLastStudentId(); // 2030 01 0002
  const lasStudentSemesterCode = lastStudentId?.substring(4, 6);
  const lasStudentYear = lastStudentId?.substring(0, 4);

  const currentSemesterCode = payload?.code;
  const currentSemesterYear = payload?.year;

  if (
    lastStudentId &&
    lasStudentSemesterCode === currentSemesterCode &&
    lasStudentYear === currentSemesterYear
  ) {
    currentId = lastStudentId?.substring(6);
  }

  // const currentId = ((await findLastStudentId()) || 0).toString();
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
};

export const findLastFacultyId = async () => {
  const faculty = await User.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  ).sort({
    createdAt: -1,
  });

  return faculty?.id ? faculty?.id : undefined;
};

export const generateFacultyId = async () => {
  const lastFacultyId = await findLastFacultyId();

  let currentId = (0).toString();
  if (lastFacultyId) {
    currentId = lastFacultyId?.substring(2);
  }
  const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  const id = `F-${incrementId}`;
  return id;
};
