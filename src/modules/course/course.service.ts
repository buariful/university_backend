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
    const deletedPreRequisiteIds = preRequisiteCourses
      .filter((el) => el.course && el.isDeleted)
      .map((el) => el.course);

    const newPreRequesiteIds = preRequisiteCourses
      .filter((el) => el.course && !el.isDeleted)
      .map((el) => el.course);

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
          course: { $each: newPreRequesiteIds },
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
