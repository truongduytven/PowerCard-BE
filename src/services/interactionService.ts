import StudySetInteractions from "../models/StudySetInteractions";
import StudySetStats from "../models/StudySetStats";
import StudySets from "../models/StudySets";
import { ApiError } from "../utils/ApiError";

class InteractionService {
  /**
   * Record a view interaction
   * Rules: Only record 1 view per user per study set per 24 hours (anti-spam)
   * Guest views (userId = null) are always recorded
   */
  async recordView(studySetId: string, userId: string | null) {
    // Check if study set exists
    const studySet = await StudySets.query().findById(studySetId);
    if (!studySet) {
      throw new ApiError(404, "Không tìm thấy bộ học tập");
    }

    // Anti-spam: Check if user already viewed in last 24 hours
    if (userId) {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const recentView = await StudySetInteractions.query()
        .where('study_set_id', studySetId)
        .where('user_id', userId)
        .where('type', 'view')
        .where('created_at', '>', twentyFourHoursAgo.toISOString())
        .first();

      if (recentView) {
        // Already viewed in last 24h, don't record again
        return;
      }
    }

    // Record the view
    await StudySetInteractions.transaction(async (trx) => {
      // Insert interaction
      await StudySetInteractions.query(trx).insert({
        studySetId,
        userId,
        type: 'view',
        createdAt: new Date().toISOString()
      });

      // Increment view count in stats
      await trx.raw(`
        INSERT INTO study_set_stats (study_set_id, views, favorites, clones, shares)
        VALUES (?, 1, 0, 0, 0)
        ON CONFLICT (study_set_id) 
        DO UPDATE SET views = study_set_stats.views + 1, updated_at = NOW()
      `, [studySetId]);
    });
  }

  /**
   * Add favorite
   */
  async addFavorite(studySetId: string, userId: string) {
    // Check if study set exists
    const studySet = await StudySets.query().findById(studySetId);
    if (!studySet) {
      throw new ApiError(404, "Không tìm thấy bộ học tập");
    }

    // Check if already favorited
    const existing = await StudySetInteractions.query()
      .where('study_set_id', studySetId)
      .where('user_id', userId)
      .where('type', 'favorite')
      .first();

    if (existing) {
      throw new ApiError(400, "Bạn đã yêu thích bộ học tập này rồi");
    }

    await StudySetInteractions.transaction(async (trx) => {
      // Insert favorite interaction
      await StudySetInteractions.query(trx).insert({
        studySetId,
        userId,
        type: 'favorite',
        createdAt: new Date().toISOString()
      });

      // Increment favorites count
      await trx.raw(`
        INSERT INTO study_set_stats (study_set_id, views, favorites, clones, shares)
        VALUES (?, 0, 1, 0, 0)
        ON CONFLICT (study_set_id) 
        DO UPDATE SET favorites = study_set_stats.favorites + 1, updated_at = NOW()
      `, [studySetId]);
    });
  }

  /**
   * Remove favorite
   */
  async removeFavorite(studySetId: string, userId: string) {
    // Check if favorited
    const existing = await StudySetInteractions.query()
      .where('study_set_id', studySetId)
      .where('user_id', userId)
      .where('type', 'favorite')
      .first();

    if (!existing) {
      throw new ApiError(404, "Bạn chưa yêu thích bộ học tập này");
    }

    await StudySetInteractions.transaction(async (trx) => {
      // Delete favorite interaction
      await StudySetInteractions.query(trx)
        .where('study_set_id', studySetId)
        .where('user_id', userId)
        .where('type', 'favorite')
        .delete();

      // Decrement favorites count
      await trx.raw(`
        UPDATE study_set_stats 
        SET favorites = GREATEST(favorites - 1, 0), updated_at = NOW()
        WHERE study_set_id = ?
      `, [studySetId]);
    });
  }

  /**
   * Record clone interaction
   */
  async recordClone(studySetId: string, userId: string) {
    const studySet = await StudySets.query().findById(studySetId);
    if (!studySet) {
      throw new ApiError(404, "Không tìm thấy bộ học tập");
    }

    await StudySetInteractions.transaction(async (trx) => {
      // Insert clone interaction
      await StudySetInteractions.query(trx).insert({
        studySetId,
        userId,
        type: 'clone',
        createdAt: new Date().toISOString()
      });

      // Increment clones count
      await trx.raw(`
        INSERT INTO study_set_stats (study_set_id, views, favorites, clones, shares)
        VALUES (?, 0, 0, 1, 0)
        ON CONFLICT (study_set_id) 
        DO UPDATE SET clones = study_set_stats.clones + 1, updated_at = NOW()
      `, [studySetId]);
    });
  }

  /**
   * Record share interaction
   */
  async recordShare(studySetId: string, userId: string | null) {
    const studySet = await StudySets.query().findById(studySetId);
    if (!studySet) {
      throw new ApiError(404, "Không tìm thấy bộ học tập");
    }

    await StudySetInteractions.transaction(async (trx) => {
      // Insert share interaction
      await StudySetInteractions.query(trx).insert({
        studySetId,
        userId,
        type: 'share',
        createdAt: new Date().toISOString()
      });

      // Increment shares count
      await trx.raw(`
        INSERT INTO study_set_stats (study_set_id, views, favorites, clones, shares)
        VALUES (?, 0, 0, 0, 1)
        ON CONFLICT (study_set_id) 
        DO UPDATE SET shares = study_set_stats.shares + 1, updated_at = NOW()
      `, [studySetId]);
    });
  }

  /**
   * Get stats for a study set
   */
  async getStats(studySetId: string) {
    const stats = await StudySetStats.query().findById(studySetId);
    
    if (!stats) {
      // Return default stats if not found
      return {
        studySetId,
        views: 0,
        favorites: 0,
        clones: 0,
        shares: 0
      };
    }

    return stats;
  }

  /**
   * Check if user has favorited a study set
   */
  async isFavorited(studySetId: string, userId: string): Promise<boolean> {
    const favorite = await StudySetInteractions.query()
      .where('study_set_id', studySetId)
      .where('user_id', userId)
      .where('type', 'favorite')
      .first();

    return !!favorite;
  }
}

export default new InteractionService();
