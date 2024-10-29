import httpStatus from 'http-status';
import AppError from '../../app/Errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../app/builder/QueryBuilder';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  // check if there any register semester is "UPCOMING" | "ONGOING"
  const isAnySemesterUpcomingOrOngoing = await SemesterRegistration.findOne({
    status: { $in: ['UPCOMING', 'ONGOING'] },
  });

  if (isAnySemesterUpcomingOrOngoing) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already a ${isAnySemesterUpcomingOrOngoing.status} semester`,
    );
  }

  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This semester is already registered',
    );
  }

  // chck if academic semester exists.
  if (academicSemester) {
    const isAcademicSemesterExists =
      await AcademicSemester.findById(academicSemester);
    if (!isAcademicSemesterExists) {
      throw new AppError(httpStatus.NOT_FOUND, 'Academic semester not found');
    }
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;

  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate('academicSemester');

  return result;
};

const updateSemesterRegistrationInDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  const requestedSemester = await SemesterRegistration.findById(id);
  // if requested semester exists
  if (!requestedSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester registration not found');
  }
  // if the  requested semester registration is ended, then we will not updated anything.
  const requestedStatus = payload?.status;
  const currentStatus = requestedSemester.status; 
  
  if (currentStatus === 'ENDED') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester is already ended`,
    );
  }

  if(currentStatus == "UPCOMING" && requestedStatus === "ENDED"){
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not directly change status from ${currentStatus} to ${requestedStatus}`,
    )
  }
};

export const SemsterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationInDB,
};
