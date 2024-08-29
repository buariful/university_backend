import { model, Schema } from 'mongoose';
import { TUser } from './user.interface';
import bycrypt from 'bcrypt';
import config from '../../app/config';

const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'faculty', 'student'],
      },
    },
    status: {
      type: String,
      enum: {
        values: ['in-progress', 'blocked'],
      },
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bycrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds),
  );
  next();
});
userSchema.post('save', async function (doc, next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  doc.password = '';
  next();
});

export const User = model<TUser>('User', userSchema);
