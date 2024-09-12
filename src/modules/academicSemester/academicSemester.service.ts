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

const updateAcademicSemester = async (
  semesterId: string,
  payload: Partial<TAcademicSemester>,
) => {
  // check if the payload has name and code and if the code is different from the mapper
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error('Invalid semester code.');
  }

  const hasYearNameInPaylod =
    Object.prototype.hasOwnProperty.call(payload, 'name') ||
    Object.prototype.hasOwnProperty.call(payload, 'year');
  const targetedSemester = await getSingleAcademicSemester(semesterId);

  if (hasYearNameInPaylod) {
    const searchPayload = {
      name: payload?.name || targetedSemester?.name,
      year: payload?.year || targetedSemester?.year,
      id: { $ne: semesterId },
    };
    // check if the semester exists with the same year and name
    const checkingIfSemesterExists = await AcademicSemester.find(searchPayload);

    if (checkingIfSemesterExists?.length) {
      throw new Error('Semester exists with same year and name');
    }
  }

  const result = await AcademicSemester.findByIdAndUpdate(semesterId, payload, {
    new: false,
  });
  return result;
};

export const AcademicSemesterService = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
