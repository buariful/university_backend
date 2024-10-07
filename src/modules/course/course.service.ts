import QueryBuilder from '../../app/builder/QueryBuilder';
import { courseSearchalbeFields } from './course.constants';
import { TCourse } from './course.interface';
import Course from './course.model';

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

  await Course.findByIdAndUpdate(id, payloadRemaining, {
    new: true,
  });

  if (preRequisiteCourses && preRequisiteCourses.length) {
    // const deletedPreRequisiteIds = preRequisiteCourses
    //   .filter((el) => el.course && el.isDeleted)
    //   .map((el) => el.course);
    const deletedPreRequisiteIds = preRequisiteCourses.map((el) => el.course);

    const newPreRequesiteIds = preRequisiteCourses
      .filter((el) => el.course && !el.isDeleted)
      .map((el) => el.course);

    /*
     * Note: $addToSet ensures uniqueness only at the top level of the array.
     * Since { course: id } objects are treated as unique as a whole, MongoDB
     * doesn't prevent adding multiple objects with the same course ID.
     *
     * To enforce uniqueness on the 'course' field within preRequisiteCourses,
     * consider:
     * 1. Using $pull to remove duplicates by course before adding new entries
     */

    // delete preRequisite
    await Course.findByIdAndUpdate(id, {
      $pull: {
        preRequisiteCourses: { course: { $in: deletedPreRequisiteIds } },
      },
    });

    // add new preRequisite
    await Course.findByIdAndUpdate(id, {
      $addToSet: {
        preRequisiteCourses: {
          $each: newPreRequesiteIds.map((requesiteId) => ({
            course: requesiteId,
          })),
        },
      },
    });
  }

  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseInfoInDB,
};
