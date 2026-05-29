import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Book, BookStatus } from '../models/Book';
import { User } from '../models/User';
import { differenceInDays } from 'date-fns';
import path from 'path';
import fs from 'fs';

const bookRepository = AppDataSource.getRepository(Book);
const userRepository = AppDataSource.getRepository(User);

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const books = await bookRepository.find({
      where: { userId },
      order: { position: 'ASC', createdAt: 'DESC' }
    });

    const booksWithProgress = books.map(book => ({
      ...book,
      progressPercentage: book.progressPercentage,
      daysRemaining: book.daysRemaining
    }));

    res.json(booksWithProgress);
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Kitaplar alınırken bir hata oluştu' });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const book = await bookRepository.findOne({
      where: { id, userId }
    });

    if (!book) {
      return res.status(404).json({ message: 'Kitap bulunamadı' });
    }

    res.json({
      ...book,
      progressPercentage: book.progressPercentage,
      daysRemaining: book.daysRemaining
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Kitap alınırken bir hata oluştu' });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { title, totalPages, startDate, targetEndDate, targetDays, status } = req.body;

    const book = bookRepository.create({
      title,
      totalPages: parseInt(totalPages),
      startDate: startDate ? new Date(startDate) : undefined,
      targetEndDate: targetEndDate ? new Date(targetEndDate) : undefined,
      targetDays: targetDays ? parseInt(targetDays) : undefined,
      status: status || BookStatus.TO_READ,
      userId,
      coverImage: req.file ? `/uploads/${req.file.filename}` : undefined
    });

    await bookRepository.save(book);

    res.status(201).json({
      message: 'Kitap eklendi',
      book: {
        ...book,
        progressPercentage: book.progressPercentage,
        daysRemaining: book.daysRemaining
      }
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Kitap eklenirken bir hata oluştu' });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { title, totalPages, currentPage, startDate, targetEndDate, targetDays, status, rating, notes } = req.body;

    const book = await bookRepository.findOne({
      where: { id, userId }
    });

    if (!book) {
      return res.status(404).json({ message: 'Kitap bulunamadı' });
    }

    const oldStatus = book.status;
    const oldCurrentPage = book.currentPage;

    if (title !== undefined) book.title = title;
    if (totalPages !== undefined) book.totalPages = parseInt(totalPages);
    if (currentPage !== undefined) {
      const newCurrentPage = parseInt(currentPage);
      book.currentPage = newCurrentPage;
      
      // Otomatik olarak tamamlanmış olarak işaretle
      if (newCurrentPage >= book.totalPages && book.status !== BookStatus.COMPLETED) {
        book.status = BookStatus.COMPLETED;
        book.currentPage = book.totalPages;
        book.completedDate = new Date();
        if (book.startDate) {
          try {
            book.actualDays = differenceInDays(new Date(), new Date(book.startDate));
          } catch (error) {
            console.error('Date calculation error:', error);
            book.actualDays = undefined;
          }
        }
      }
    }
    if (startDate !== undefined) book.startDate = startDate ? new Date(startDate) : undefined;
    if (targetEndDate !== undefined) book.targetEndDate = targetEndDate ? new Date(targetEndDate) : undefined;
    if (targetDays !== undefined) book.targetDays = targetDays ? parseInt(targetDays) : undefined;
    if (status !== undefined) book.status = status;
    if (rating !== undefined) book.rating = parseFloat(rating);
    if (notes !== undefined) book.notes = notes;
    if (req.file) {
      // Delete old image if exists
      if (book.coverImage) {
        const oldImagePath = path.join(__dirname, '../../', book.coverImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      book.coverImage = `/uploads/${req.file.filename}`;
    }

    // If book is completed, calculate actual days
    if (book.status === BookStatus.COMPLETED && oldStatus !== BookStatus.COMPLETED) {
      if (!book.completedDate) {
        book.completedDate = new Date();
      }
      if (book.startDate && !book.actualDays) {
        book.actualDays = differenceInDays(book.completedDate, new Date(book.startDate));
      }

      // Update user stats
      const user = await userRepository.findOne({ where: { id: userId } });
      if (user) {
        user.totalBooksCompleted += 1;
        const remainingPages = book.totalPages - oldCurrentPage;
        if (remainingPages > 0) {
          user.totalPagesRead += remainingPages;
        }
        await userRepository.save(user);
      }
    }

    // Update pages read if current page changed
    if (currentPage !== undefined && parseInt(currentPage) > oldCurrentPage) {
      const pagesRead = parseInt(currentPage) - oldCurrentPage;
      const user = await userRepository.findOne({ where: { id: userId } });
      if (user) {
        user.totalPagesRead += pagesRead;
        await userRepository.save(user);
      }
    }

    await bookRepository.save(book);

    res.json({
      message: 'Kitap güncellendi',
      book: {
        ...book,
        progressPercentage: book.progressPercentage,
        daysRemaining: book.daysRemaining
      }
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Kitap güncellenirken bir hata oluştu' });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const book = await bookRepository.findOne({
      where: { id, userId }
    });

    if (!book) {
      return res.status(404).json({ message: 'Kitap bulunamadı' });
    }

    // Delete cover image if exists
    if (book.coverImage) {
      const imagePath = path.join(__dirname, '../../', book.coverImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await bookRepository.remove(book);

    res.json({ message: 'Kitap silindi' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Kitap silinirken bir hata oluştu' });
  }
};

export const updateBookStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { status, position } = req.body;

    const book = await bookRepository.findOne({
      where: { id, userId }
    });

    if (!book) {
      return res.status(404).json({ message: 'Kitap bulunamadı' });
    }

    const oldStatus = book.status;

    if (status !== undefined) book.status = status;
    if (position !== undefined) book.position = position;

    // If book is completed
    if (status === BookStatus.COMPLETED && oldStatus !== BookStatus.COMPLETED) {
      book.completedDate = new Date();
      book.currentPage = book.totalPages;
      if (book.startDate) {
        try {
          const days = differenceInDays(new Date(), new Date(book.startDate));
          book.actualDays = days > 0 ? days : 1;
        } catch (error) {
          console.error('Date calculation error:', error);
        }
      }

      // Update user stats
      const user = await userRepository.findOne({ where: { id: userId } });
      if (user) {
        user.totalBooksCompleted += 1;
        const remainingPages = book.totalPages - book.currentPage;
        if (remainingPages > 0) {
          user.totalPagesRead += remainingPages;
        }
        await userRepository.save(user);
      }
    }

    // If book is moved to reading
    if (status === BookStatus.READING && !book.startDate) {
      book.startDate = new Date();
    }

    await bookRepository.save(book);

    res.json({
      message: 'Kitap durumu güncellendi',
      book: {
        ...book,
        progressPercentage: book.progressPercentage,
        daysRemaining: book.daysRemaining
      }
    });
  } catch (error) {
    console.error('Update book status error:', error);
    res.status(500).json({ message: 'Kitap durumu güncellenirken bir hata oluştu' });
  }
};
