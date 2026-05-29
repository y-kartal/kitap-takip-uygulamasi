import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Test } from '../models/Test';
import { Between } from 'typeorm';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from 'date-fns';

const testRepository = AppDataSource.getRepository(Test);

export const getAllTests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const tests = await testRepository.find({
      where: { userId },
      order: { testDate: 'DESC', createdAt: 'DESC' }
    });

    res.json(tests);
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({ message: 'Testler alınırken bir hata oluştu' });
  }
};

export const getTestById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const test = await testRepository.findOne({
      where: { id, userId }
    });

    if (!test) {
      return res.status(404).json({ message: 'Test bulunamadı' });
    }

    res.json(test);
  } catch (error) {
    console.error('Get test error:', error);
    res.status(500).json({ message: 'Test alınırken bir hata oluştu' });
  }
};

export const createTest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { 
      testName, 
      testNumber, 
      testDate,
      turkceCorrect, turkceWrong, turkceEmpty,
      matematikCorrect, matematikWrong, matematikEmpty,
      hayatBilgisiCorrect, hayatBilgisiWrong, hayatBilgisiEmpty,
      ingilizceCorrect, ingilizceWrong, ingilizceEmpty,
      notes 
    } = req.body;

    const test = testRepository.create({
      testName,
      testNumber: parseInt(testNumber),
      testDate: new Date(testDate),
      turkceCorrect: parseInt(turkceCorrect) || 0,
      turkceWrong: parseInt(turkceWrong) || 0,
      turkceEmpty: parseInt(turkceEmpty) || 0,
      matematikCorrect: parseInt(matematikCorrect) || 0,
      matematikWrong: parseInt(matematikWrong) || 0,
      matematikEmpty: parseInt(matematikEmpty) || 0,
      hayatBilgisiCorrect: parseInt(hayatBilgisiCorrect) || 0,
      hayatBilgisiWrong: parseInt(hayatBilgisiWrong) || 0,
      hayatBilgisiEmpty: parseInt(hayatBilgisiEmpty) || 0,
      ingilizceCorrect: parseInt(ingilizceCorrect) || 0,
      ingilizceWrong: parseInt(ingilizceWrong) || 0,
      ingilizceEmpty: parseInt(ingilizceEmpty) || 0,
      notes,
      userId
    });

    test.calculateNets();
    await testRepository.save(test);

    res.status(201).json({
      message: 'Test eklendi',
      test
    });
  } catch (error) {
    console.error('Create test error:', error);
    res.status(500).json({ message: 'Test eklenirken bir hata oluştu' });
  }
};

export const updateTest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { 
      testName, 
      testNumber, 
      testDate,
      turkceCorrect, turkceWrong, turkceEmpty,
      matematikCorrect, matematikWrong, matematikEmpty,
      hayatBilgisiCorrect, hayatBilgisiWrong, hayatBilgisiEmpty,
      ingilizceCorrect, ingilizceWrong, ingilizceEmpty,
      notes 
    } = req.body;

    const test = await testRepository.findOne({
      where: { id, userId }
    });

    if (!test) {
      return res.status(404).json({ message: 'Test bulunamadı' });
    }

    if (testName !== undefined) test.testName = testName;
    if (testNumber !== undefined) test.testNumber = parseInt(testNumber);
    if (testDate !== undefined) test.testDate = new Date(testDate);
    
    if (turkceCorrect !== undefined) test.turkceCorrect = parseInt(turkceCorrect);
    if (turkceWrong !== undefined) test.turkceWrong = parseInt(turkceWrong);
    if (turkceEmpty !== undefined) test.turkceEmpty = parseInt(turkceEmpty);
    
    if (matematikCorrect !== undefined) test.matematikCorrect = parseInt(matematikCorrect);
    if (matematikWrong !== undefined) test.matematikWrong = parseInt(matematikWrong);
    if (matematikEmpty !== undefined) test.matematikEmpty = parseInt(matematikEmpty);
    
    if (hayatBilgisiCorrect !== undefined) test.hayatBilgisiCorrect = parseInt(hayatBilgisiCorrect);
    if (hayatBilgisiWrong !== undefined) test.hayatBilgisiWrong = parseInt(hayatBilgisiWrong);
    if (hayatBilgisiEmpty !== undefined) test.hayatBilgisiEmpty = parseInt(hayatBilgisiEmpty);
    
    if (ingilizceCorrect !== undefined) test.ingilizceCorrect = parseInt(ingilizceCorrect);
    if (ingilizceWrong !== undefined) test.ingilizceWrong = parseInt(ingilizceWrong);
    if (ingilizceEmpty !== undefined) test.ingilizceEmpty = parseInt(ingilizceEmpty);
    
    if (notes !== undefined) test.notes = notes;

    test.calculateNets();
    await testRepository.save(test);

    res.json({
      message: 'Test güncellendi',
      test
    });
  } catch (error) {
    console.error('Update test error:', error);
    res.status(500).json({ message: 'Test güncellenirken bir hata oluştu' });
  }
};

export const deleteTest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const test = await testRepository.findOne({
      where: { id, userId }
    });

    if (!test) {
      return res.status(404).json({ message: 'Test bulunamadı' });
    }

    await testRepository.remove(test);

    res.json({ message: 'Test silindi' });
  } catch (error) {
    console.error('Delete test error:', error);
    res.status(500).json({ message: 'Test silinirken bir hata oluştu' });
  }
};

export const getTestStatistics = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { period = 'all' } = req.query;

    let dateFilter: any = {};
    const now = new Date();

    if (period === 'week') {
      dateFilter = Between(startOfWeek(now), endOfWeek(now));
    } else if (period === 'month') {
      dateFilter = Between(startOfMonth(now), endOfMonth(now));
    }

    const whereClause: any = { userId };
    if (period !== 'all') {
      whereClause.testDate = dateFilter;
    }

    const tests = await testRepository.find({
      where: whereClause,
      order: { testDate: 'ASC' }
    });

    // Calculate statistics by subject
    const subjects = ['Türkçe', 'Matematik', 'Hayat Bilgisi', 'İngilizce'];
    const subjectStats: any = {};

    // Map subject names to database field prefixes
    const subjectKeyMap: { [key: string]: string } = {
      'Türkçe': 'turkce',
      'Matematik': 'matematik',
      'Hayat Bilgisi': 'hayatBilgisi',
      'İngilizce': 'ingilizce'
    };

    subjects.forEach(subject => {
      const keyPrefix = subjectKeyMap[subject];
      const correctKey = `${keyPrefix}Correct` as keyof Test;
      const wrongKey = `${keyPrefix}Wrong` as keyof Test;
      const emptyKey = `${keyPrefix}Empty` as keyof Test;
      const netKey = `${keyPrefix}Net` as keyof Test;

      const totalCorrect = tests.reduce((sum, t) => sum + (t[correctKey] as number || 0), 0);
      const totalWrong = tests.reduce((sum, t) => sum + (t[wrongKey] as number || 0), 0);
      const totalEmpty = tests.reduce((sum, t) => sum + (t[emptyKey] as number || 0), 0);
      const avgNet = tests.length > 0 ? tests.reduce((sum, t) => sum + (t[netKey] as number || 0), 0) / tests.length : 0;
      
      const totalQuestions = totalCorrect + totalWrong + totalEmpty;
      const avgSuccess = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      subjectStats[subject] = {
        count: tests.length,
        averageNet: Math.round(avgNet * 100) / 100,
        averageSuccess: avgSuccess,
        totalCorrect,
        totalWrong,
        totalEmpty
      };
    });

    // Find best and worst subjects
    let bestSubject = null;
    let worstSubject = null;

    if (tests.length > 0) {
      bestSubject = subjects.reduce((best, current) => 
        subjectStats[current].averageSuccess > subjectStats[best].averageSuccess ? current : best
      );
      worstSubject = subjects.reduce((worst, current) => 
        subjectStats[current].averageSuccess < subjectStats[worst].averageSuccess ? current : worst
      );
    }

    // Weekly progress
    const weeklyData = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(now, i));
      const weekEnd = endOfWeek(subWeeks(now, i));
      const weekTests = tests.filter(t => {
        const testDate = new Date(t.testDate);
        return testDate >= weekStart && testDate <= weekEnd;
      });
      
      if (weekTests.length > 0) {
        const avgSuccess = weekTests.reduce((sum, t) => sum + t.successPercentage, 0) / weekTests.length;
        weeklyData.push({
          week: `Hafta ${4 - i}`,
          averageSuccess: Math.round(avgSuccess),
          testCount: weekTests.length
        });
      } else {
        weeklyData.push({
          week: `Hafta ${4 - i}`,
          averageSuccess: 0,
          testCount: 0
        });
      }
    }

    // Monthly progress
    const monthlyData = [];
    for (let i = 3; i >= 0; i--) {
      const monthStart = startOfMonth(subWeeks(now, i * 4));
      const monthEnd = endOfMonth(subWeeks(now, i * 4));
      const monthTests = tests.filter(t => {
        const testDate = new Date(t.testDate);
        return testDate >= monthStart && testDate <= monthEnd;
      });
      
      if (monthTests.length > 0) {
        const avgSuccess = monthTests.reduce((sum, t) => sum + t.successPercentage, 0) / monthTests.length;
        monthlyData.push({
          month: monthStart.toLocaleDateString('tr-TR', { month: 'short' }),
          averageSuccess: Math.round(avgSuccess),
          testCount: monthTests.length
        });
      } else {
        monthlyData.push({
          month: monthStart.toLocaleDateString('tr-TR', { month: 'short' }),
          averageSuccess: 0,
          testCount: 0
        });
      }
    }

    res.json({
      totalTests: tests.length,
      subjectStats,
      bestSubject,
      worstSubject,
      weeklyProgress: weeklyData,
      monthlyProgress: monthlyData,
      recentTests: tests.slice(-5).reverse()
    });
  } catch (error) {
    console.error('Get test statistics error:', error);
    res.status(500).json({ message: 'İstatistikler alınırken bir hata oluştu' });
  }
};
