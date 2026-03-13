import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const SALT_ROUNDS = 12;

interface AuthResult {
  token: string;
  user: Omit<IUser, 'password'>;
}

function signToken(userId: string, role: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  };

  return jwt.sign({ sub: userId, role }, secret, options);
}

export async function registerUser(email: string, password: string): Promise<IUser> {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already in use') as Error & { statusCode: number };
    err.statusCode = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ email, password: hashed });
  return user;
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const err = new Error('Invalid credentials') as Error & { statusCode: number };
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error('Invalid credentials') as Error & { statusCode: number };
    err.statusCode = 401;
    throw err;
  }

  const token = signToken(user._id.toString(), user.role);

  // Return user without password (toJSON handles this, but we recast for TypeScript)
  const safeUser = user.toJSON() as unknown as Omit<IUser, 'password'>;
  return { token, user: safeUser };
}
