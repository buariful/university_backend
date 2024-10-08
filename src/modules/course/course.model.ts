import { model, Schema } from 'mongoose';
import {
  TCourse,
  TCourseFaculty,
  TPreRequisiteCourse,
} from './course.interface';

const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourse>(
  {
    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'course',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    prefix: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: Number,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },
    preRequisiteCourses: [preRequisiteCoursesSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

courseSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

courseSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

const Course = model<TCourse>('course', courseSchema);
export default Course;

const courseFacultySchema = new Schema<TCourseFaculty>(
  {
    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Course',
      unique: true,
    },
    faculties: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Faculty',
        },
      ],
      required: true,
      ref: 'faculty',
    },
  },
  {
    timestamps: true,
  },
);

export const CourseFaculty = model<TCourseFaculty>(
  'CourseFaculty',
  courseFacultySchema,
);
