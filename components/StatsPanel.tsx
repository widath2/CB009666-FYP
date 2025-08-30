"use client";

import { BarChart3, Clock, BookOpen, TrendingUp, Award, Target } from "lucide-react";

interface ReadingStats {
  totalSessions: number;
  totalWordsRead: number;
  totalWordsSimplified: number;
  totalTimeReading: number;
  totalTimeListening: number;
  averageWordsPerMinute: number;
  improvementRate: number;
  completedSessions: number;
}

interface StatsPanelProps {
  stats: ReadingStats;
  weeklyProgress?: {
    sessionsCompleted: number;
    totalWords: number;
    totalTime: number;
    averageWPM: number;
  };
}

export default function StatsPanel({ stats, weeklyProgress }: StatsPanelProps) {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getReadingLevel = (wpm: number): { level: string; color: string; icon: string } => {
    if (wpm >= 250) return { level: "Advanced", color: "text-green-600", icon: "🚀" };
    if (wpm >= 200) return { level: "Good", color: "text-blue-600", icon: "⭐" };
    if (wpm >= 150) return { level: "Average", color: "text-yellow-600", icon: "📚" };
    return { level: "Learning", color: "text-purple-600", icon: "🌱" };
  };

  const readingLevel = getReadingLevel(stats.averageWordsPerMinute);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reading Statistics</h2>
          <p className="text-gray-600">Track your progress and improvements</p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {/* Total Sessions */}
        <div className="text-center p-4 bg-blue-50 rounded-2xl">
          <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-800">{stats.totalSessions}</div>
          <div className="text-sm text-blue-600">Sessions</div>
        </div>

        {/* Total Words */}
        <div className="text-center p-4 bg-green-50 rounded-2xl">
          <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-800">{stats.totalWordsRead.toLocaleString()}</div>
          <div className="text-sm text-green-600">Words Read</div>
        </div>

        {/* Reading Speed */}
        <div className="text-center p-4 bg-purple-50 rounded-2xl">
          <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-800">{stats.averageWordsPerMinute}</div>
          <div className="text-sm text-purple-600">WPM</div>
        </div>

        {/* Completion Rate */}
        <div className="text-center p-4 bg-orange-50 rounded-2xl">
          <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-800">{stats.improvementRate}%</div>
          <div className="text-sm text-orange-600">Complete</div>
        </div>
      </div>

      {/* Reading Level Badge */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-200">
          <span className="text-2xl">{readingLevel.icon}</span>
          <span className={`font-bold ${readingLevel.color}`}>
            {readingLevel.level} Reader
          </span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-700">{stats.averageWordsPerMinute} WPM</span>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Time Breakdown */}
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Time Spent</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Reading:</span>
              <span className="font-medium text-gray-800">{formatTime(stats.totalTimeReading)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Listening:</span>
              <span className="font-medium text-gray-800">{formatTime(stats.totalTimeListening)}</span>
            </div>
            <div className="border-t pt-2 flex items-center justify-between">
              <span className="font-medium text-gray-800">Total:</span>
              <span className="font-bold text-blue-700">
                {formatTime(stats.totalTimeReading + stats.totalTimeListening)}
              </span>
            </div>
          </div>
        </div>

        {/* Improvement Stats */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Improvements</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Words Simplified:</span>
              <span className="font-medium text-gray-800">{stats.totalWordsSimplified.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Sessions Completed:</span>
              <span className="font-medium text-gray-800">{stats.completedSessions}</span>
            </div>
            <div className="border-t pt-2 flex items-center justify-between">
              <span className="font-medium text-gray-800">Success Rate:</span>
              <span className="font-bold text-green-700">{stats.improvementRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      {weeklyProgress && (
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📊 This Week's Progress
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-purple-700">{weeklyProgress.sessionsCompleted}</div>
              <div className="text-xs text-purple-600">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-pink-700">{weeklyProgress.totalWords.toLocaleString()}</div>
              <div className="text-xs text-pink-600">Words</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-700">{formatTime(weeklyProgress.totalTime)}</div>
              <div className="text-xs text-blue-600">Time</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-700">{weeklyProgress.averageWPM}</div>
              <div className="text-xs text-green-600">WPM</div>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Messages */}
      <div className="mt-6 text-center">
        {stats.totalSessions === 0 && (
          <p className="text-gray-500 italic">Start reading to see your statistics! 📚</p>
        )}
        {stats.totalSessions > 0 && stats.completedSessions === 0 && (
          <p className="text-blue-600 italic">Great start! Complete a session to see your progress 🌟</p>
        )}
        {stats.completedSessions >= 1 && stats.completedSessions < 5 && (
          <p className="text-green-600 italic">You're making great progress! Keep it up! 🚀</p>
        )}
        {stats.completedSessions >= 5 && stats.completedSessions < 10 && (
          <p className="text-purple-600 italic">Excellent work! You're becoming a reading pro! 🏆</p>
        )}
        {stats.completedSessions >= 10 && (
          <p className="text-gold-600 italic">Amazing dedication! You're a reading champion! 👑</p>
        )}
      </div>
    </div>
  );
}