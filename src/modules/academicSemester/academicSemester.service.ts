import { academicSemesterNameCodeMapper } from './academicSemester.constants';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid semester code.');
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllAcademicSemester = async () => {
  const result = await AcademicSemester.find();
  return result;
};

const getSingleAcademicSemester = async (semesterId: string) => {
  const result = await AcademicSemester.findById(semesterId);
  return result;
};

export const AcademicSemesterService = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemester,
  getSingleAcademicSemester,
};
