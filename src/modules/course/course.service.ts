import mongoose from 'mongoose';
import QueryBuilder from '../../app/builder/QueryBuilder';
import { courseSearchalbeFields } from './course.constants';
import { TCourse, TCourseFaculty } from './course.interface';
import Course, { CourseFaculty } from './course.model';
import AppError from '../../app/Errors/AppError';
import httpStatus from 'http-status';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),

    query,
  )
    .search(courseSearchalbeFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

const updateCourseInfoInDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...payloadRemaining } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      payloadRemaining,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updatedBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to updated course');
    }

    if (preRequisiteCourses && preRequisiteCourses.length) {
      const deletedPreRequisiteIds = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      const newPreRequesiteIds = preRequisiteCourses
        .filter((el) => el.course && !el.isDeleted)
        .map((el) => el.course);

      // delete preRequisite
      await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisiteIds } },
          },
        },
        {
          session,
          new: true,
          runValidators: true,
        },
      );

      // add new preRequisite
      await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            preRequisiteCourses: {
              $each: newPreRequesiteIds.map((requesiteId) => ({
                course: requesiteId,
              })),
            },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
    }

    await session.commitTransaction();
    await session.endSession();

    const result = await Course.findById(id).populate(
      'preRequisiteCourses.course',
    );
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to updated course');
  }
};

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: {
        faculties: {
          $each: payload,
        },
      },
    },
    { upsert: true, new: true },
  );
  return result;
};

const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: {
        faculties: {
          $in: payload,
        },
      },
    },
    { new: true },
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseInfoInDB,
  assignFacultiesWithCourseIntoDB,
  removeFacultiesFromCourseFromDB,
};
