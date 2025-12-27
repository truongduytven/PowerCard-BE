import UserLogs from "../models/UserLog";
import LearnFlashcards from "../models/LearnFlashcards";
import UserLearns from "../models/UserLearns";
import knex from "../configs/db";

class OverviewService {
  async getOverviewBlock(userId: string) {
    const [streak, activity, accuracy, todayProgress] = await Promise.all([
      this.calculateStreak(userId),
      this.calculateActivity(userId),
      this.calculateAccuracy(userId),
      this.calculateTodayProgress(userId),
    ]);

    return {
      streak,
      activity,
      accuracy,
      todayProgress,
    };
  }

  private async calculateStreak(userId: string) {
    const userLog = await UserLogs.query().where('userId', userId).first();

    if (!userLog) {
      return { current: 0, best: 0 };
    }

    return {
      current: userLog.recordStreaks,
      best: userLog.longestStreaks,
    };
  }

  private async calculateActivity(userId: string) {
    const userLearns = await UserLearns.query()
      .where('userId', userId)
      .select('id');

    const userLearnIds = userLearns.map(ul => ul.id);

    if (userLearnIds.length === 0) {
      return { cardsStudied: 0, cardsMastered: 0 };
    }

    const result = await knex('learn_flashcards')
      .whereIn('user_learn_id', userLearnIds)
      .select(
        knex.raw('COUNT(*) as cards_studied'),
        knex.raw('COUNT(CASE WHEN is_learned = true THEN 1 END) as cards_mastered')
      )
      .first();

    return {
      cardsStudied: parseInt(result?.cards_studied || '0'),
      cardsMastered: parseInt(result?.cards_mastered || '0'),
    };
  }

  private async calculateAccuracy(userId: string) {
    const userLearns = await UserLearns.query()
      .where('userId', userId)
      .select('id');

    const userLearnIds = userLearns.map(ul => ul.id);

    if (userLearnIds.length === 0) {
      return { rate: 0 };
    }

    const learnFlashcards = await LearnFlashcards.query()
      .whereIn('userLearnId', userLearnIds)
      .withGraphFetched('difficulty')
      .select('id', 'difficultyId');

    if (learnFlashcards.length === 0) {
      return { rate: 0 };
    }

    let totalScore = 0;
    learnFlashcards.forEach((lf: any) => {
      if (!lf.difficulty) return;

      const difficultyName = lf.difficulty.name;
      if (difficultyName === 'Easy') {
        totalScore += 1;
      } else if (difficultyName === 'Medium') {
        totalScore += 0.5;
      }
    });

    const accuracyRate = (totalScore / learnFlashcards.length) * 100;

    return { rate: parseFloat(accuracyRate.toFixed(2)) };
  }

  private async calculateTodayProgress(userId: string) {
    const userLearns = await UserLearns.query()
      .where('userId', userId)
      .select('id');

    const userLearnIds = userLearns.map(ul => ul.id);

    if (userLearnIds.length === 0) {
      return { cards: 0, compareYesterday: 0 };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await knex('learn_flashcards')
      .whereIn('user_learn_id', userLearnIds)
      .whereNotNull('last_reviewed_at')
      .select(
        knex.raw(`COUNT(CASE WHEN last_reviewed_at >= ? AND last_reviewed_at < ? THEN 1 END) as today_cards`, [today.toISOString(), tomorrow.toISOString()]),
        knex.raw(`COUNT(CASE WHEN last_reviewed_at >= ? AND last_reviewed_at < ? THEN 1 END) as yesterday_cards`, [yesterday.toISOString(), today.toISOString()])
      )
      .first();

    const todayCards = parseInt(result?.today_cards || '0');
    const yesterdayCards = parseInt(result?.yesterday_cards || '0');

    const compareYesterday = yesterdayCards === 0 
      ? (todayCards > 0 ? 100 : 0)
      : ((todayCards - yesterdayCards) / yesterdayCards) * 100;

    return {
      cards: todayCards,
      compareYesterday: parseFloat(compareYesterday.toFixed(2)),
    };
  }

  async getLearningProgress(userId: string) {
    const userLearns = await UserLearns.query()
      .where('userId', userId)
      .withGraphFetched('studyset')
      .select('id', 'studySetId', 'processing');

    if (userLearns.length === 0) {
      return {
        weeklyActivity: null,
        studySets: []
      };
    }

    const studySetProgress = await Promise.all(
      userLearns.map(async (ul: any) => {
        const totalCards = await knex('learn_flashcards')
          .where('user_learn_id', ul.id)
          .count('* as count')
          .first();

        const learnedCards = await knex('learn_flashcards')
          .where('user_learn_id', ul.id)
          .where('is_learned', true)
          .count('* as count')
          .first();

        const total = parseInt(String(totalCards?.count || '0'));
        const learned = parseInt(String(learnedCards?.count || '0'));
        const percentage = total > 0 ? Math.round((learned / total) * 100) : 0;

        return {
          id: ul.studySetId,
          title: ul.studyset?.title || '',
          percentage,
          learnedCards: learned,
          totalCards: total
        };
      })
    );

    const sortedStudySets = studySetProgress
      .sort((a, b) => b.percentage - a.percentage);

    return {
      weeklyActivity: null,
      studySets: sortedStudySets
    };
  }

  async getWeeklyActivity(userId: string) {
    const userLearns = await UserLearns.query()
      .where('userId', userId)
      .select('id');

    if (userLearns.length === 0) {
      return [];
    }

    const userLearnIds = userLearns.map(ul => ul.id);
    return this.calculateWeeklyActivity(userLearnIds);
  }

  async getActivityHeatmap(userId: string, period: 'week' | 'month' | 'year' = 'week') {
    const userLearns = await UserLearns.query()
      .where('userId', userId)
      .select('id');

    if (userLearns.length === 0) {
      return [];
    }

    const userLearnIds = userLearns.map(ul => ul.id);

    switch (period) {
      case 'month':
        return this.calculateMonthlyActivity(userLearnIds);
      case 'year':
        return this.calculateYearlyActivity(userLearnIds);
      default:
        return this.calculateWeeklyActivity(userLearnIds);
    }
  }

  private async calculateMonthlyActivity(userLearnIds: string[]) {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const reviews = await knex('learn_flashcards as lf')
      .whereIn('lf.user_learn_id', userLearnIds)
      .whereNotNull('lf.last_reviewed_at')
      .where('lf.last_reviewed_at', '>=', startOfMonth.toISOString())
      .leftJoin('difficulties as d', 'lf.difficulty_id', 'd.id')
      .select(
        'lf.last_reviewed_at',
        'd.name as difficulty_name'
      );

    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const monthlyData: any[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(today.getFullYear(), today.getMonth(), day);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      const dayReviews = reviews.filter((r: any) => {
        const reviewDate = new Date(r.last_reviewed_at);
        return reviewDate >= date && reviewDate < nextDay;
      });

      const minutes = dayReviews.length * 2;

      let accuracyScore = 0;
      dayReviews.forEach((r: any) => {
        if (r.difficulty_name === 'Easy') {
          accuracyScore += 1;
        } else if (r.difficulty_name === 'Medium') {
          accuracyScore += 0.5;
        }
      });

      const accuracy = dayReviews.length > 0 
        ? Math.round((accuracyScore / dayReviews.length) * 100) 
        : 0;

      monthlyData.push({
        date: date.toISOString().split('T')[0],
        day: day,
        minutes,
        accuracy,
        cardsStudied: dayReviews.length
      });
    }

    return monthlyData;
  }

  private async calculateYearlyActivity(userLearnIds: string[]) {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    startOfYear.setHours(0, 0, 0, 0);

    const reviews = await knex('learn_flashcards as lf')
      .whereIn('lf.user_learn_id', userLearnIds)
      .whereNotNull('lf.last_reviewed_at')
      .where('lf.last_reviewed_at', '>=', startOfYear.toISOString())
      .leftJoin('difficulties as d', 'lf.difficulty_id', 'd.id')
      .select(
        'lf.last_reviewed_at',
        'd.name as difficulty_name'
      );

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const yearlyData: any[] = [];

    for (let month = 0; month < 12; month++) {
      const startOfMonth = new Date(today.getFullYear(), month, 1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const endOfMonth = new Date(today.getFullYear(), month + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);

      const monthReviews = reviews.filter((r: any) => {
        const reviewDate = new Date(r.last_reviewed_at);
        return reviewDate >= startOfMonth && reviewDate <= endOfMonth;
      });

      const minutes = monthReviews.length * 2;

      let accuracyScore = 0;
      monthReviews.forEach((r: any) => {
        if (r.difficulty_name === 'Easy') {
          accuracyScore += 1;
        } else if (r.difficulty_name === 'Medium') {
          accuracyScore += 0.5;
        }
      });

      const accuracy = monthReviews.length > 0 
        ? Math.round((accuracyScore / monthReviews.length) * 100) 
        : 0;

      yearlyData.push({
        month: monthNames[month],
        monthNumber: month + 1,
        minutes,
        accuracy,
        cardsStudied: monthReviews.length
      });
    }

    return yearlyData;
  }

  private async calculateWeeklyActivity(userLearnIds: string[]) {
    if (userLearnIds.length === 0) {
      return null;
    }

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const reviews = await knex('learn_flashcards as lf')
      .whereIn('lf.user_learn_id', userLearnIds)
      .whereNotNull('lf.last_reviewed_at')
      .where('lf.last_reviewed_at', '>=', sevenDaysAgo.toISOString())
      .leftJoin('difficulties as d', 'lf.difficulty_id', 'd.id')
      .select(
        'lf.last_reviewed_at',
        'd.name as difficulty_name'
      );

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData: any[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      const dayReviews = reviews.filter((r: any) => {
        const reviewDate = new Date(r.last_reviewed_at);
        return reviewDate >= date && reviewDate < nextDay;
      });

      const minutes = dayReviews.length * 2;

      let accuracyScore = 0;
      dayReviews.forEach((r: any) => {
        if (r.difficulty_name === 'Easy') {
          accuracyScore += 1;
        } else if (r.difficulty_name === 'Medium') {
          accuracyScore += 0.5;
        }
      });

      const accuracy = dayReviews.length > 0 
        ? Math.round((accuracyScore / dayReviews.length) * 100) 
        : 0;

      weeklyData.push({
        day: dayNames[date.getDay()],
        minutes,
        accuracy,
        cardsStudied: dayReviews.length
      });
    }

    return weeklyData;
  }

  async getLearningInsights(userId: string) {
    const userLearns = await UserLearns.query()
      .where('userId', userId)
      .select('id', 'studySetId');

    if (userLearns.length === 0) {
      return {
        peakStudyTime: null,
        mostProductiveDay: null,
        masteredTopic: null,
        needsImprovement: null
      };
    }

    const userLearnIds = userLearns.map(ul => ul.id);

    const [peakStudyTime, mostProductiveDay, masteredTopic, needsImprovement] = await Promise.all([
      this.calculatePeakStudyTime(userLearnIds),
      this.calculateMostProductiveDay(userLearnIds),
      this.calculateMasteredTopic(userId, userLearnIds),
      this.calculateNeedsImprovement(userId, userLearnIds)
    ]);

    return {
      peakStudyTime,
      mostProductiveDay,
      masteredTopic,
      needsImprovement
    };
  }

  private async calculatePeakStudyTime(userLearnIds: string[]) {
    if (!userLearnIds || userLearnIds.length === 0) {
      return null;
    }

    const reviews = await LearnFlashcards.query()
      .whereIn('user_learn_id', userLearnIds)
      .whereNotNull('last_reviewed_at')
      .select('last_reviewed_at as lastReviewedAt');

    if (reviews.length === 0) {
      return null;
    }

    const hourCounts: { [key: number]: number } = {};
    reviews.forEach((review: any) => {
      const reviewDate = new Date(review.lastReviewedAt);
      const hour = reviewDate.getHours();
      if (!isNaN(hour)) {
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });

    const entries = Object.entries(hourCounts);
    if (entries.length === 0) {
      return null;
    }

    const peakHourEntry = entries.sort(([, a], [, b]) => (b as number) - (a as number))[0];

    if (!peakHourEntry) return null;

    const hour = parseInt(peakHourEntry[0]);
    
    if (isNaN(hour)) {
      return null;
    }
    
    // Format start time
    const startHour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const startPeriod = hour < 12 ? 'AM' : 'PM';
    const startTime = `${startHour12}:00 ${startPeriod}`;
    
    // Format end time (2 hours later)
    const endHour24 = hour + 2;
    const endHour12 = endHour24 === 0 ? 12 : endHour24 > 12 ? endHour24 - 12 : endHour24;
    const endPeriod = endHour24 < 12 || endHour24 === 24 ? 'AM' : 'PM';
    const endTime = `${endHour12}:00 ${endPeriod}`;

    return {
      timeRange: `${startTime} - ${endTime}`,
      description: 'Highest concentration in evening'
    };
  }

  private async calculateMostProductiveDay(userLearnIds: string[]) {
    if (!userLearnIds || userLearnIds.length === 0) {
      return null;
    }

    const reviews = await LearnFlashcards.query()
      .whereIn('user_learn_id', userLearnIds)
      .whereNotNull('last_reviewed_at')
      .select('last_reviewed_at as lastReviewedAt');

    console.log('Most Productive Day - Reviews count:', reviews.length);

    if (reviews.length === 0) {
      return null;
    }

    const dayCounts: { [key: string]: number } = {};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    reviews.forEach((review: any) => {
      const reviewDate = new Date(review.lastReviewedAt);
      const day = reviewDate.getDay();
      if (!isNaN(day) && day >= 0 && day <= 6) {
        const dayName = dayNames[day];
        if (dayName) {
          dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
        }
      }
    });

    const entries = Object.entries(dayCounts);
    if (entries.length === 0) {
      return null;
    }

    const mostProductiveDayEntry = entries.sort(([, a], [, b]) => (b as number) - (a as number))[0];

    if (!mostProductiveDayEntry || !mostProductiveDayEntry[0]) {
      return null;
    }

    return {
      day: mostProductiveDayEntry[0],
      description: 'Best weekly performance'
    };
  }

  private async calculateMasteredTopic(userId: string, userLearnIds: string[]) {
    const studySetsWithAccuracy = await knex('learn_flashcards as lf')
      .whereIn('lf.user_learn_id', userLearnIds)
      .innerJoin('user_learns as ul', 'lf.user_learn_id', 'ul.id')
      .innerJoin('study_sets as ss', 'ul.study_set_id', 'ss.id')
      .innerJoin('topics as t', 'ss.topic_id', 't.id')
      .leftJoin('difficulties as d', 'lf.difficulty_id', 'd.id')
      .groupBy('t.id', 't.name')
      .select(
        't.id',
        't.name',
        knex.raw('COUNT(*) as total_cards'),
        knex.raw(`SUM(CASE 
          WHEN d.name = 'Easy' THEN 1 
          WHEN d.name = 'Medium' THEN 0.5 
          ELSE 0 
        END) as score`)
      );

    if (studySetsWithAccuracy.length === 0) {
      return null;
    }

    const topicAccuracy = studySetsWithAccuracy.map((topic: any) => {
      const total = parseInt(topic.total_cards);
      const score = parseFloat(topic.score || '0');
      const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
      return {
        name: topic.name,
        accuracy
      };
    }).sort((a, b) => b.accuracy - a.accuracy)[0];

    return {
      topic: topicAccuracy.name,
      accuracy: topicAccuracy.accuracy,
      description: `Average ${topicAccuracy.accuracy}% accuracy`
    };
  }

  private async calculateNeedsImprovement(userId: string, userLearnIds: string[]) {
    const studySetsWithAccuracy = await knex('learn_flashcards as lf')
      .whereIn('lf.user_learn_id', userLearnIds)
      .innerJoin('user_learns as ul', 'lf.user_learn_id', 'ul.id')
      .innerJoin('study_sets as ss', 'ul.study_set_id', 'ss.id')
      .innerJoin('topics as t', 'ss.topic_id', 't.id')
      .leftJoin('difficulties as d', 'lf.difficulty_id', 'd.id')
      .groupBy('t.id', 't.name')
      .select(
        't.id',
        't.name',
        knex.raw('COUNT(*) as total_cards'),
        knex.raw(`SUM(CASE 
          WHEN d.name = 'Easy' THEN 1 
          WHEN d.name = 'Medium' THEN 0.5 
          ELSE 0 
        END) as score`)
      );

    if (studySetsWithAccuracy.length === 0) {
      return null;
    }

    const topicAccuracy = studySetsWithAccuracy.map((topic: any) => {
      const total = parseInt(topic.total_cards);
      const score = parseFloat(topic.score || '0');
      const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
      return {
        name: topic.name,
        accuracy
      };
    }).sort((a, b) => a.accuracy - b.accuracy)[0];

    return {
      topic: topicAccuracy.name,
      accuracy: topicAccuracy.accuracy,
      description: `Study speed can increase 30%`
    };
  }

  async getDeckPerformance(userId: string) {
    const userLearns = await UserLearns.query()
      .where('userId', userId)
      .where('status', 'active')
      .withGraphFetched('studyset')
      .select('id', 'studySetId', 'processing');

    const deckPerformance = await Promise.all(
      userLearns.map(async (ul: any) => {
        const studySet = ul.studyset;
        
        if (!studySet) {
          return null;
        }

        // Tổng số flashcards
        const totalFlashcards = await knex('flashcards')
          .where('study_set_id', ul.studySetId)
          .where('status', 'active')
          .count('id as count')
          .first();

        const total = parseInt(String(totalFlashcards?.count || '0'));

        // Số flashcards đã study (có trong learn_flashcards)
        const studiedFlashcards = await knex('learn_flashcards')
          .where('user_learn_id', ul.id)
          .whereNotNull('last_reviewed_at')
          .count('id as count')
          .first();

        const studied = parseInt(String(studiedFlashcards?.count || '0'));

        // Số flashcards mastered (difficulty = Easy)
        const masteredFlashcards = await knex('learn_flashcards as lf')
          .where('lf.user_learn_id', ul.id)
          .leftJoin('difficulties as d', 'lf.difficulty_id', 'd.id')
          .where('d.name', 'Easy')
          .count('lf.id as count')
          .first();

        const mastered = parseInt(String(masteredFlashcards?.count || '0'));

        // Progress (%)
        const progress = total > 0 ? Math.round((studied / total) * 100) : 0;

        // Last studied (lấy last_reviewed_at mới nhất)
        const lastReview = await knex('learn_flashcards')
          .where('user_learn_id', ul.id)
          .whereNotNull('last_reviewed_at')
          .orderBy('last_reviewed_at', 'desc')
          .first();

        return {
          studySetId: studySet.id,
          name: studySet.title,
          description: studySet.description,
          icon: studySet.icon,
          progress,
          totalCards: total,
          cardsStudied: studied,
          cardsMastered: mastered,
          lastStudied: lastReview ? lastReview.last_reviewed_at : null
        };
      })
    );

    return deckPerformance.filter(deck => deck !== null);
  }
}

export default new OverviewService();