import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
}

export interface LoginResult {
  token: string;
  user: Omit<IUser, 'password'>;
}

const generateToken = (payload: AuthPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');

  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '7d',
  });
};

export const registerUser = async (
  email: string,
  password: string
): Promise<IUser> => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  return user;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const payload: AuthPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const token = generateToken(payload);

  return { token, user };
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id).select('-password');
};
