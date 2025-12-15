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
}

export default new OverviewService();