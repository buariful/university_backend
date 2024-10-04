import { model, Schema } from 'mongoose';
import { TFaculty, TFacultyModel, TUserName } from './faculty.interface';
import { bloodGroups } from './faculty.constants';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const facultySchema = new Schema<TFaculty>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: userNameSchema,
      required: true,
    },
    gender: {
      required: true,
      type: String,
      enum: {
        values: ['male', 'female'],
        message: '{VALUE} is not supported',
      },
    },
    academicDepartment: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
    academicFaculty: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
    profileImg: {
      type: String,
    },
    bloodGroup: {
      type: String,
      enum: { values: bloodGroups },
    },
    contactNo: {
      required: true,
      type: String,
    },
    emergencyContactNo: {
      required: true,
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },

    email: {
      required: true,
      type: String,
      unique: true,
    },
    designation: {
      required: true,
      type: String,
    },
    presentAddress: {
      required: true,
      type: String,
    },
    permanentAddress: {
      required: true,
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
  },
);

// virtual
facultySchema.virtual('fullName').get(function () {
  return (
    this?.name?.firstName +
    ' ' +
    this?.name?.middleName +
    ' ' +
    this?.name?.lastName
  );
});

// query middlewares
facultySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

facultySchema.pre('findOne', function (next) {
  this.findOne({ isDeleted: { $ne: true } });

  next();
});

facultySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });

  next();
});

// methods
facultySchema.methods.isUserExists = async function (id: string) {
  const existingUser = await Faculty.findOne({ id });
  return existingUser;
};

export const Faculty = model<TFaculty, TFacultyModel>('faculty', facultySchema);
