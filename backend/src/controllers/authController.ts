import { Request, Response } from 'express';
import db from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { UserRole } from '../types';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, phone, password, full_name, role = UserRole.GUIDE } = req.body;

    // Check if user already exists
    const existingUser = await db('users')
      .where({ email })
      .orWhere({ phone })
      .first();

    if (existingUser) {
      throw new AppError('User with this email or phone already exists', 400);
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create user
    const [userId] = await db('users')
      .insert({
        email,
        phone,
        password_hash,
        role
      })
      .returning('id');

    // If registering as guide, create guide profile
    if (role === UserRole.GUIDE) {
      await db('guides').insert({
        user_id: typeof userId === 'object' ? userId.id : userId,
        full_name,
        status: 'pending'
      });
    }

    // Generate token
    const token = generateToken({
      userId: typeof userId === 'object' ? userId.id : userId,
      email,
      role
    });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: typeof userId === 'object' ? userId.id : userId,
        email,
        role
      }
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Registration failed', 500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await db('users').where({ email }).first();

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Update last login
    await db('users').where({ id: user.id }).update({ last_login: db.fn.now() });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Login failed', 500);
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const user = await db('users')
      .select('id', 'email', 'phone', 'role', 'created_at')
      .where({ id: userId })
      .first();

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // If user is a guide, get guide profile
    if (user.role === UserRole.GUIDE) {
      const guide = await db('guides').where({ user_id: userId }).first();
      res.json({ ...user, guide });
    } else {
      res.json(user);
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to get profile', 500);
  }
};
