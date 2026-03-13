import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'user' | 'admin';

export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent password from being returned in queries by default
userSchema.set('toJSON', {
  transform(_doc, ret) {
    const r = ret as Partial<typeof ret> & { password?: string };
    delete r.password;
    return r;
  },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
