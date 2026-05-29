import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

const userRepository = AppDataSource.getRepository(User);

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await userRepository.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'kitap-test-secret-key-2024',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        dailyReadingGoal: user.dailyReadingGoal
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Giriş yapılırken bir hata oluştu' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      dailyReadingGoal: user.dailyReadingGoal,
      totalPagesRead: user.totalPagesRead,
      totalBooksCompleted: user.totalBooksCompleted,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Profil bilgileri alınırken bir hata oluştu' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, dailyReadingGoal } = req.body;

    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (name) user.name = name;
    if (dailyReadingGoal !== undefined) user.dailyReadingGoal = dailyReadingGoal;

    await userRepository.save(user);

    res.json({
      message: 'Profil güncellendi',
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        dailyReadingGoal: user.dailyReadingGoal
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Profil güncellenirken bir hata oluştu' });
  }
};
