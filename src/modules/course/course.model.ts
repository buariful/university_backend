import { model, Schema } from 'mongoose';
import { TCourse, TPreRequisiteCourse } from './course.interface';

const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourse>({
  course: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'course',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new Schema<TCourse>({
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
});

const Course = model<TCourse>('course', courseSchema);
export default Course;
