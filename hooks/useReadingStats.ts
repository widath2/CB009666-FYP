"use client";

import { useState, useEffect, useCallback } from 'react';

interface ReadingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  originalTextLength: number;
  simplifiedTextLength: number;
  wordsSimplified: number;
  timeSpentReading: number; // in seconds
  timeSpentListening: number; // in seconds
  completed: boolean;
}

interface ReadingStats {
  totalSessions: number;
  totalWordsRead: number;
  totalWordsSimplified: number;
  totalTimeReading: number; // in seconds
  totalTimeListening: number; // in seconds
  averageWordsPerMinute: number;
  improvementRate: number; // percentage
  favoriteFeatures: string[];
  completedSessions: number;
}

export const useReadingStats = () => {
  const [currentSession, setCurrentSession] = useState<ReadingSession | null>(null);
  const [stats, setStats] = useState<ReadingStats>({
    totalSessions: 0,
    totalWordsRead: 0,
    totalWordsSimplified: 0,
    totalTimeReading: 0,
    totalTimeListening: 0,
    averageWordsPerMinute: 0,
    improvementRate: 0,
    favoriteFeatures: [],
    completedSessions: 0,
  });

  // Load stats from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('readingStats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (error) {
        console.warn('Failed to load reading stats:', error);
      }
    }
  }, []);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('readingStats', JSON.stringify(stats));
  }, [stats]);

  const startNewSession = useCallback((originalText: string, simplifiedText: string, wordsSimplified: number) => {
    const session: ReadingSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      originalTextLength: originalText.length,
      simplifiedTextLength: simplifiedText.length,
      wordsSimplified,
      timeSpentReading: 0,
      timeSpentListening: 0,
      completed: false,
    };

    setCurrentSession(session);

    // Update stats
    setStats(prev => ({
      ...prev,
      totalSessions: prev.totalSessions + 1,
      totalWordsRead: prev.totalWordsRead + originalText.split(' ').length,
      totalWordsSimplified: prev.totalWordsSimplified + wordsSimplified,
    }));
  }, []);

  const updateReadingTime = useCallback((additionalSeconds: number) => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      timeSpentReading: currentSession.timeSpentReading + additionalSeconds,
    };

    setCurrentSession(updatedSession);

    setStats(prev => ({
      ...prev,
      totalTimeReading: prev.totalTimeReading + additionalSeconds,
    }));
  }, [currentSession]);

  const updateListeningTime = useCallback((additionalSeconds: number) => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      timeSpentListening: currentSession.timeSpentListening + additionalSeconds,
    };

    setCurrentSession(updatedSession);

    setStats(prev => ({
      ...prev,
      totalTimeListening: prev.totalTimeListening + additionalSeconds,
      averageWordsPerMinute: calculateWPM(prev.totalWordsRead, prev.totalTimeListening + additionalSeconds),
    }));
  }, [currentSession]);

  const completeSession = useCallback(() => {
    if (!currentSession) return;

    const completedSession = {
      ...currentSession,
      endTime: new Date(),
      completed: true,
    };

    setCurrentSession(completedSession);

    setStats(prev => ({
      ...prev,
      completedSessions: prev.completedSessions + 1,
      improvementRate: calculateImprovementRate(prev.completedSessions + 1, prev.totalSessions),
    }));

    // Save completed session to history
    const sessionHistory = JSON.parse(localStorage.getItem('sessionHistory') || '[]');
    sessionHistory.push(completedSession);
    localStorage.setItem('sessionHistory', JSON.stringify(sessionHistory.slice(-50))); // Keep last 50 sessions
  }, [currentSession]);

  const trackFeatureUsage = useCallback((feature: string) => {
    setStats(prev => {
      const updatedFeatures = [...prev.favoriteFeatures];
      const existingIndex = updatedFeatures.indexOf(feature);
      
      if (existingIndex === -1) {
        updatedFeatures.push(feature);
      }

      return {
        ...prev,
        favoriteFeatures: updatedFeatures.slice(-10), // Keep last 10 features
      };
    });
  }, []);

  const getSessionHistory = useCallback((): ReadingSession[] => {
    const history = localStorage.getItem('sessionHistory');
    return history ? JSON.parse(history) : [];
  }, []);

  const getWeeklyProgress = useCallback(() => {
    const history = getSessionHistory();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyStats = history
      .filter(session => new Date(session.startTime) >= oneWeekAgo)
      .reduce(
        (acc, session) => ({
          sessionsCompleted: acc.sessionsCompleted + (session.completed ? 1 : 0),
          totalWords: acc.totalWords + session.originalTextLength,
          totalTime: acc.totalTime + session.timeSpentReading + session.timeSpentListening,
          averageWPM: 0, // Will calculate below
        }),
        { sessionsCompleted: 0, totalWords: 0, totalTime: 0, averageWPM: 0 }
      );

    weeklyStats.averageWPM = calculateWPM(weeklyStats.totalWords, weeklyStats.totalTime);

    return weeklyStats;
  }, [getSessionHistory]);

  const resetStats = useCallback(() => {
    setStats({
      totalSessions: 0,
      totalWordsRead: 0,
      totalWordsSimplified: 0,
      totalTimeReading: 0,
      totalTimeListening: 0,
      averageWordsPerMinute: 0,
      improvementRate: 0,
      favoriteFeatures: [],
      completedSessions: 0,
    });
    setCurrentSession(null);
    localStorage.removeItem('readingStats');
    localStorage.removeItem('sessionHistory');
  }, []);

  return {
    currentSession,
    stats,
    startNewSession,
    updateReadingTime,
    updateListeningTime,
    completeSession,
    trackFeatureUsage,
    getSessionHistory,
    getWeeklyProgress,
    resetStats,
  };
};

// Helper functions
function calculateWPM(totalWords: number, totalTimeSeconds: number): number {
  if (totalTimeSeconds === 0) return 0;
  const totalMinutes = totalTimeSeconds / 60;
  return Math.round(totalWords / totalMinutes);
}

function calculateImprovementRate(completedSessions: number, totalSessions: number): number {
  if (totalSessions === 0) return 0;
  return Math.round((completedSessions / totalSessions) * 100);
}