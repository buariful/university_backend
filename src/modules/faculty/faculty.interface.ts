import { Model, Types } from 'mongoose';

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type TFaculty = {
  id: string;
  user: string;
  name: TUserName;
  gender: 'male' | 'female';
  dateOfBirth: Date;
  email: string;
  contactNo?: string;
  emergencyContactNo: string;
  bloodGroup?: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  academicDepartment: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  designation: string;
  profileImg?: string;
  isDeleted: boolean;
};

export type TFacultyMethods = {
  // eslint-disable-next-line no-unused-vars
  isUserExists(id: string): Promise<TFaculty | null>;
};

export type TFacultyModel = Model<
  TFaculty,
  Record<string, unknown>,
  TFacultyMethods
>;
