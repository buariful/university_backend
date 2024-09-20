import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
  },
  {
    timestamps: true,
  },
);

academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExists = await AcademicDepartment.findOne({
    name: this.name,
  });

  if (isDepartmentExists) {
    throw new Error('This department is already exists');
  }

  next();
});

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  // findOneAndUpdate e j query thiye find korbe seta ekhane get hobe, example: {_id: 1w6er5we9r5c3g4w9er65};
  const query = this.getQuery();
  const isDepartmentExists = await AcademicDepartment.findOne(query);

  if (!isDepartmentExists) {
    throw new Error("This department doesn't exists");
  }

  next();
});

export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
