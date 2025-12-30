import StudySets from "../models/StudySets";
import Topics from "../models/Topics";
import Flashcards from "../models/Flashcards";
import Media from "../models/Media";
import knex from "../configs/db";
import interactionService from "./interactionService";
import StudySetStats from "../models/StudySetStats";
import FolderSets from "../models/FolderSets";
import FolderStudySets from "../models/FolderStudySets";

interface CreateStudySetBody {
  title: string;
  description: string;
  topicId: string;
  icon: string | null;
  folderSetId: string | null;
  isPublic: boolean;
  type: string;
  flashcards: {
    mediaId: string | null;
    position: number;
    term: string;
    definition: string;
  }[];
}

interface UpdateFlashcard {
  id?: string;
  mediaId: string | null;
  position: number;
  term: string;
  definition: string;
}

function isUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

class StudySetService {
  async getListStudySets(userId: string, isAuthor?: string, isLearning?: string) {
    const studySets = await StudySets.query()
      .alias("ss")
      .modify((queryBuilder) => {
        if (isAuthor) {
          if (isAuthor === "true") {
            queryBuilder.where("ss.userId", userId);
          } else {
            queryBuilder.whereNot("ss.userId", userId);
            queryBuilder.andWhere("ss.is_public", true);
          }
        } else {
          queryBuilder.andWhere("ss.is_public", true);
        }
        if (isLearning) {
          if (isLearning === "true") {
            queryBuilder
              .innerJoin("user_learns as ul", function() {
                this.on("ss.id", "=", "ul.studySetId")
                  .andOn("ul.userId", "=", knex.raw("?", [userId]))
                  .andOn("ul.status", "=", knex.raw("?", ["active"]));
              });
          }
        }
      })
      .innerJoin("users", "ss.userId", "users.id")
      .innerJoin("topics", "ss.topicId", "topics.id")
      .leftJoin("reviews as r", "r.study_set_id", "ss.id")
      .leftJoin("study_set_stats as stats", "ss.id", "stats.study_set_id")
      .leftJoin(
        knex.raw(`(
          SELECT 
            ul2.study_set_id,
            COUNT(DISTINCT ul2.user_id)::int as num_user_learn,
            MAX(lf.last_reviewed_at) as last_study_at
          FROM user_learns ul2
          LEFT JOIN learn_flashcards lf ON ul2.id = lf.user_learn_id
          WHERE ul2.status = 'active'
          GROUP BY ul2.study_set_id
        ) as ul_stats`),
        'ss.id',
        'ul_stats.study_set_id'
      )
      .groupBy(
        "ss.id",
        "ss.title",
        "ss.icon",
        "ss.description",
        "topics.name",
        "users.username",
        "users.avatar_url",
        "ss.is_public",
        "ss.number_of_flashcards",
        "ss.from_study_set_id",
        "ss.type",
        "ss.created_at",
        "ss.updated_at",
        "stats.views",
        "stats.favorites",
        "stats.clones",
        "stats.shares",
        "ul_stats.num_user_learn",
        "ul_stats.last_study_at"
      )
      .modify((queryBuilder) => {
        if (isLearning === "true") {
          queryBuilder.select("ul.processing as processing");
          queryBuilder.groupBy("ul.processing");
        }
      })
      .select(
        "ss.id",
        "ss.icon",
        "ss.title",
        "ss.description",
        "topics.name as topic_name",
        "users.username",
        "users.avatar_url",
        "ss.is_public",
        "ss.number_of_flashcards",
        "ss.from_study_set_id",
        "ss.type",
        "ss.created_at",
        "ss.updated_at",
        knex.raw("COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float as avg_rating"),
        knex.raw("COUNT(r.id)::int as number_of_reviews"),
        knex.raw("COALESCE(stats.views, 0) as views"),
        knex.raw("COALESCE(stats.favorites, 0) as favorites"),
        knex.raw("COALESCE(stats.clones, 0) as clones"),
        knex.raw("COALESCE(stats.shares, 0) as shares"),
        knex.raw("COALESCE(ul_stats.num_user_learn, 0) as num_user_learn"),
        knex.raw("ul_stats.last_study_at as last_study_at")
      );

    return studySets;
  }

  // Lấy studyset mà user tự tạo
  async getMyStudySets(userId: string) {
    const studySets = await StudySets.query()
      .alias("ss")
      .where("ss.userId", userId)
      .andWhere("ss.status", "active")
      .innerJoin("users", "ss.userId", "users.id")
      .innerJoin("topics", "ss.topicId", "topics.id")
      .leftJoin("reviews as r", "r.study_set_id", "ss.id")
      .leftJoin("study_set_stats as stats", "ss.id", "stats.study_set_id")
      .leftJoin(
        knex.raw(`(
          SELECT 
            ul2.study_set_id,
            COUNT(DISTINCT ul2.user_id)::int as num_user_learn,
            MAX(lf.last_reviewed_at) as last_study_at
          FROM user_learns ul2
          LEFT JOIN learn_flashcards lf ON ul2.id = lf.user_learn_id
          WHERE ul2.status = 'active'
          GROUP BY ul2.study_set_id
        ) as ul_stats`),
        'ss.id',
        'ul_stats.study_set_id'
      )
      .groupBy(
        "ss.id",
        "ss.title",
        "ss.icon",
        "ss.description",
        "topics.name",
        "users.username",
        "users.avatar_url",
        "ss.is_public",
        "ss.number_of_flashcards",
        "ss.from_study_set_id",
        "ss.type",
        "ss.created_at",
        "ss.updated_at",
        "stats.views",
        "stats.favorites",
        "stats.clones",
        "stats.shares",
        "ul_stats.num_user_learn",
        "ul_stats.last_study_at"
      )
      .select(
        "ss.id",
        "ss.icon",
        "ss.title",
        "ss.description",
        "topics.name as topic_name",
        "users.username",
        "users.avatar_url",
        "ss.is_public",
        "ss.number_of_flashcards",
        "ss.from_study_set_id",
        "ss.type",
        "ss.created_at",
        "ss.updated_at",
        knex.raw("COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float as avg_rating"),
        knex.raw("COUNT(r.id)::int as number_of_reviews"),
        knex.raw("COALESCE(stats.views, 0) as views"),
        knex.raw("COALESCE(stats.favorites, 0) as favorites"),
        knex.raw("COALESCE(stats.clones, 0) as clones"),
        knex.raw("COALESCE(stats.shares, 0) as shares"),
        knex.raw("COALESCE(ul_stats.num_user_learn, 0) as num_user_learn"),
        knex.raw("ul_stats.last_study_at as last_study_at")
      )
      .orderBy("ss.updated_at", "desc");

    return studySets;
  }

  // Lấy studyset đang học
  async getLearningStudySets(userId: string) {
    const studySets = await StudySets.query()
      .alias("ss")
      .andWhere("ss.status", "active")
      .innerJoin("user_learns as ul", function() {
        this.on("ss.id", "=", "ul.studySetId")
          .andOn("ul.userId", "=", knex.raw("?", [userId]))
          .andOn("ul.status", "=", knex.raw("?", ["active"]));
      })
      .innerJoin("users", "ss.userId", "users.id")
      .innerJoin("topics", "ss.topicId", "topics.id")
      .leftJoin("reviews as r", "r.study_set_id", "ss.id")
      .leftJoin("study_set_stats as stats", "ss.id", "stats.study_set_id")
      .leftJoin(
        knex.raw(`(
          SELECT 
            ul2.study_set_id,
            COUNT(DISTINCT ul2.user_id)::int as num_user_learn,
            MAX(lf.last_reviewed_at) as last_study_at
          FROM user_learns ul2
          LEFT JOIN learn_flashcards lf ON ul2.id = lf.user_learn_id
          WHERE ul2.status = 'active'
          GROUP BY ul2.study_set_id
        ) as ul_stats`),
        'ss.id',
        'ul_stats.study_set_id'
      )
      .groupBy(
        "ss.id",
        "ss.title",
        "ss.icon",
        "ss.description",
        "topics.name",
        "users.username",
        "users.avatar_url",
        "ss.is_public",
        "ss.number_of_flashcards",
        "ss.from_study_set_id",
        "ss.type",
        "ss.created_at",
        "ss.updated_at",
        "stats.views",
        "stats.favorites",
        "stats.clones",
        "stats.shares",
        "ul_stats.num_user_learn",
        "ul_stats.last_study_at",
        "ul.processing"
      )
      .select(
        "ss.id",
        "ss.icon",
        "ss.title",
        "ss.description",
        "topics.name as topic_name",
        "users.username",
        "users.avatar_url",
        "ss.is_public",
        "ss.number_of_flashcards",
        "ss.from_study_set_id",
        "ss.type",
        "ss.created_at",
        "ss.updated_at",
        "ul.processing as processing",
        knex.raw("COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float as avg_rating"),
        knex.raw("COUNT(r.id)::int as number_of_reviews"),
        knex.raw("COALESCE(stats.views, 0) as views"),
        knex.raw("COALESCE(stats.favorites, 0) as favorites"),
        knex.raw("COALESCE(stats.clones, 0) as clones"),
        knex.raw("COALESCE(stats.shares, 0) as shares"),
        knex.raw("COALESCE(ul_stats.num_user_learn, 0) as num_user_learn"),
        knex.raw("ul_stats.last_study_at as last_study_at")
      )
      .orderBy("ul_stats.last_study_at", "desc");

    return studySets;
  }

  // Lấy studyset public trong hệ thống (có search và pagination)
  async getPublicStudySets(
    userId: string, 
    page: number = 1, 
    limit: number = 20, 
    search?: string, 
    topicId?: string
  ) {
    const offset = (page - 1) * limit;

    let query = StudySets.query()
      .alias("ss")
      .where("ss.is_public", true)
      .whereNot("ss.userId", userId) // Không lấy studyset của bản thân
      .andWhere("ss.status", "active")
      .innerJoin("users", "ss.userId", "users.id")
      .innerJoin("topics", "ss.topicId", "topics.id")
      .leftJoin("reviews as r", "r.study_set_id", "ss.id")
      .leftJoin("study_set_stats as stats", "ss.id", "stats.study_set_id")
      .leftJoin(
        knex.raw(`(
          SELECT 
            ul2.study_set_id,
            COUNT(DISTINCT ul2.user_id)::int as num_user_learn,
            MAX(lf.last_reviewed_at) as last_study_at
          FROM user_learns ul2
          LEFT JOIN learn_flashcards lf ON ul2.id = lf.user_learn_id
          WHERE ul2.status = 'active'
          GROUP BY ul2.study_set_id
        ) as ul_stats`),
        'ss.id',
        'ul_stats.study_set_id'
      );

    // Apply search filter
    if (search) {
      query = query.where(function() {
        this.where('ss.title', 'ilike', `%${search}%`)
          .orWhere('ss.description', 'ilike', `%${search}%`)
          .orWhere('users.username', 'ilike', `%${search}%`);
      });
    }

    // Apply topic filter
    if (topicId) {
      query = query.where('ss.topicId', topicId);
    }

    // Count total for pagination (separate query without groupBy)
    let countQuery = StudySets.query()
      .alias("ss")
      .where("ss.is_public", true)
      .whereNot("ss.userId", userId)
      .andWhere("ss.status", "active");

    if (search) {
      countQuery = countQuery
        .innerJoin("users", "ss.userId", "users.id")
        .where(function() {
          this.where('ss.title', 'ilike', `%${search}%`)
            .orWhere('ss.description', 'ilike', `%${search}%`)
            .orWhere('users.username', 'ilike', `%${search}%`);
        });
    }

    if (topicId) {
      countQuery = countQuery.where('ss.topicId', topicId);
    }

    const countResult = await countQuery.count('* as total').first();
    const totalRecords = parseInt((countResult as any)?.total as string || '0');
    const totalPages = Math.ceil(totalRecords / limit);

    // Get paginated results
    const studySets = await query
      .groupBy(
        "ss.id",
        "ss.title",
        "ss.icon",
        "ss.description",
        "topics.name",
        "users.username",
        "users.avatar_url",
        "ss.is_public",
        "ss.number_of_flashcards",
        "ss.from_study_set_id",
        "ss.type",
        "ss.created_at",
        "ss.updated_at",
        "stats.views",
        "stats.favorites",
        "stats.clones",
        "stats.shares",
        "ul_stats.num_user_learn",
        "ul_stats.last_study_at"
      )
      .select(
        "ss.id",
        "ss.icon",
        "ss.title",
        "ss.description",
        "topics.name as topic_name",
        "users.username",
        "users.avatar_url",
        "ss.is_public",
        "ss.number_of_flashcards",
        "ss.from_study_set_id",
        "ss.type",
        "ss.created_at",
        "ss.updated_at",
        knex.raw("COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float as avg_rating"),
        knex.raw("COUNT(r.id)::int as number_of_reviews"),
        knex.raw("COALESCE(stats.views, 0) as views"),
        knex.raw("COALESCE(stats.favorites, 0) as favorites"),
        knex.raw("COALESCE(stats.clones, 0) as clones"),
        knex.raw("COALESCE(stats.shares, 0) as shares"),
        knex.raw("COALESCE(ul_stats.num_user_learn, 0) as num_user_learn"),
        knex.raw("ul_stats.last_study_at as last_study_at")
      )
      .orderBy("ss.created_at", "desc")
      .limit(limit)
      .offset(offset);

    return {
      data: studySets,
      pagination: {
        page,
        limit,
        total: totalRecords,
        totalPages
      }
    };
  }

  async getStudySetById(studySetId: string, userId: string | null = null) {
    const studySet = await StudySets.query()
      .alias("ss")
      .innerJoin("users", "ss.userId", "users.id")
      .innerJoin("topics", "ss.topicId", "topics.id")
      .leftJoin("reviews as r", "r.study_set_id", "ss.id")
      .leftJoin("study_set_stats as stats", "ss.id", "stats.study_set_id")
      .where("ss.id", studySetId)
      .andWhere("ss.status", "active")
      .groupBy(
        "ss.id",
        "ss.userId",
        "ss.title",
        "ss.description",
        "topics.name",
        "users.username",
        "users.avatar_url",
        "ss.is_public",
        "ss.number_of_flashcards",
        "ss.from_study_set_id",
        "ss.type",
        "ss.created_at",
        "ss.updated_at",
        "stats.views",
        "stats.favorites",
        "stats.clones",
        "stats.shares"
      )
      .select(
        "ss.id",
        knex.raw(
          "CASE WHEN ss.user_id = ? THEN true ELSE false END as is_author",
          [userId]
        ),
        "ss.title",
        "ss.description",
        "topics.name as topic_name",
        "users.username",
        "users.avatar_url",
        "ss.is_public",
        "ss.number_of_flashcards",
        "ss.from_study_set_id",
        "ss.type",
        "ss.created_at",
        "ss.updated_at",
        knex.raw("COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float as avg_rating"),
        knex.raw("COUNT(r.id)::int as number_of_reviews"),
        knex.raw("COALESCE(stats.views, 0) as views"),
        knex.raw("COALESCE(stats.favorites, 0) as favorites"),
        knex.raw("COALESCE(stats.clones, 0) as clones"),
        knex.raw("COALESCE(stats.shares, 0) as shares")
      )
      .first();
    
    if (!studySet) {
      throw { status: 404, message: "Không tìm thấy bộ học tập" };
    }

    // Record view interaction (async, don't wait)
    interactionService.recordView(studySetId, userId).catch(err => {
      console.error("Error recording view:", err);
    });

    const flashcards = await Flashcards.query()
      .alias("flashcards")
      .leftJoin("media as media", "flashcards.mediaId", "media.id")
      .where("flashcards.studySetId", studySetId)
      .select(
        "flashcards.id",
        "media.imageUrl as media_url",
        "flashcards.position",
        "flashcards.term",
        "flashcards.definition" 
      )
      .orderBy("position", "asc");

    // Check if user has favorited this study set
    let isFavorited = false;
    if (userId) {
      isFavorited = await interactionService.isFavorited(studySetId, userId);
    }

    return {
      ...studySet,
      flashcards: flashcards,
      isFavorited
    };
  }

  async createStudySet(userId: string, body: CreateStudySetBody) {
    if (!body.title || !body.topicId || !Array.isArray(body.flashcards)) {
      throw { status: 400, message: "Yêu cầu không hợp lệ" };
    }

    if (body.type !== "ORIGINAL" && body.type !== "QUIZLET") {
      throw { status: 400, message: "Loại bộ học tập không hợp lệ" };
    }

    if (body.type === "QUIZLET" && body.isPublic === true) {
      throw { status: 400, message: "Bộ học tập từ Quizlet không được phép public" };
    }

    const exitStudySet = await StudySets.query()
      .where("userId", userId)
      .andWhere("title", body.title)
      .first();

    if (exitStudySet) {
      throw { status: 400, message: "Bạn đã có bộ học tập với tiêu đề này" };
    }

    let finalTopicId = body.topicId;

    if (!isUUID(body.topicId)) {
      const existingTopic = await Topics.query()
        .where("LOWER(name) = ?", body.topicId.toLowerCase())
        .first();

      if (existingTopic) {
        finalTopicId = existingTopic.id;
      } else {
        const newTopic = await Topics.query().insert({
          name: body.topicId,
          status: "active",
        });
        finalTopicId = newTopic.id;
      }
    }

    const newStudySet = await StudySets.query().insert({
      userId,
      title: body.title,
      description: body.description,
      icon: body.icon || null,
      topicId: finalTopicId,
      isPublic: body.isPublic,
      numberOfFlashcards: body.flashcards.length,
      fromStudySetId: null,
      type: body.type,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (body.folderSetId) {
      const checkFolderSet = await FolderSets.query()
          .where("id", body.folderSetId)
          .andWhere("userId", userId)
          .increment("numberOfStudySets", 1)
          .first();

      if(checkFolderSet) {
        await FolderStudySets.query().insert({
          folderSetId: body.folderSetId,
          studySetId: newStudySet.id,
          status: "active",
        });
      }
    }

    // Create stats entry for the new study set
    await StudySetStats.query().insert({
      studySetId: newStudySet.id,
      views: 0,
      favorites: 0,
      clones: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    await Promise.all(
      body.flashcards.map(async (flashcard) => {
        const flashcardInsert = Flashcards.query().insert({
          studySetId: newStudySet.id,
          mediaId: flashcard.mediaId,
          position: flashcard.position,
          term: flashcard.term,
          definition: flashcard.definition,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        let mediaUpdate;
        if (flashcard.mediaId) {
          const media = await Media.query().findById(flashcard.mediaId);

          if (media && !media.name) {
            mediaUpdate = Media.query()
              .findById(flashcard.mediaId)
              .patch({ name: flashcard.term })
              .modify((e) => {
                if(body.isPublic) {
                  e.patch({ isPublic: true });
                }
              });
          }
        }
        await Promise.all([flashcardInsert, mediaUpdate]);
      })
    );
  }

  async updateStudySet(id: string, userId: string, body: CreateStudySetBody) {
    const studySet = await StudySets.query()
      .where("id", id)
      .andWhere("userId", userId)
      .first();

    if (!studySet) {
      throw { status: 404, message: "Không tìm thấy bộ học tập" };
    }

    if ((studySet.type === "CLONE" || studySet.type === "QUIZLET") && body.isPublic === true) {
      throw { status: 400, message: "Bộ học tập không được phép chỉnh sửa thành public" };
    }

    if (body.title && body.title !== studySet.title) {
      const existingStudySet = await StudySets.query()
        .where("userId", userId)
        .andWhere("title", body.title)
        .whereNot("id", id)
        .first();

      if (existingStudySet) {
        throw { status: 400, message: "Bạn đã có bộ học tập với tiêu đề này" };
      }
    }

    await StudySets.transaction(async (trx) => {
      let finalTopicId = body.topicId || studySet.topicId;

      if (body.topicId && !isUUID(body.topicId)) {
        const existingTopic = await Topics.query(trx)
          .where("LOWER(name) = ?", body.topicId.toLowerCase())
          .first();

        if (existingTopic) {
          finalTopicId = existingTopic.id;
        } else {
          const newTopic = await Topics.query(trx).insert({
            name: body.topicId,
            status: "active",
          });
          finalTopicId = newTopic.id;
        }
      }

      await StudySets.query(trx).patchAndFetchById(id, {
        title: body.title || studySet.title,
        description: body.description || studySet.description,
        icon: body.icon !== undefined ? body.icon : studySet.icon,
        topicId: finalTopicId,
        isPublic: body.isPublic !== undefined ? body.isPublic : studySet.isPublic,
        numberOfFlashcards: body.flashcards?.length || studySet.numberOfFlashcards,
        updatedAt: new Date().toISOString(),
      });

      if (Array.isArray(body.flashcards)) {
        const existingFlashcards = await Flashcards.query(trx)
          .where("studySetId", id);

        const existingFlashcardIds = existingFlashcards.map((f) => f.id);
        const newFlashcardIds = body.flashcards
          .filter((f: any) => f.id)
          .map((f: any) => f.id);

        const toDelete = existingFlashcardIds.filter(
          (fId) => !newFlashcardIds.includes(fId)
        );

        if (toDelete.length > 0) {
          await Flashcards.query(trx).whereIn("id", toDelete).delete();
        }

        await Promise.all(
          body.flashcards.map(async (flashcard: UpdateFlashcard) => {
            if (flashcard.id && existingFlashcardIds.includes(flashcard.id)) {
              await Flashcards.query(trx).patchAndFetchById(flashcard.id, {
                mediaId: flashcard.mediaId,
                position: flashcard.position,
                term: flashcard.term,
                definition: flashcard.definition,
                updatedAt: new Date().toISOString(),
              });
            } else {
              await Flashcards.query(trx).insert({
                studySetId: id,
                mediaId: flashcard.mediaId,
                position: flashcard.position,
                term: flashcard.term,
                definition: flashcard.definition,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            }

            if (flashcard.mediaId) {
              const media = await Media.query(trx).findById(flashcard.mediaId);
              if (media && !media.name) {
                await Media.query(trx)
                  .findById(flashcard.mediaId)
                  .patch({ name: flashcard.term })
                  .modify((e) => {
                    if(body.isPublic) {
                      e.patch({ isPublic: true });
                    } else {
                      e.patch({ isPublic: false });
                    }
                  });
              }
            }
          })
        );
      }
    });
  }

  async deleteStudySet(id: string, userId: string) {
    const studySet = await StudySets.query()
      .where("id", id)
      .andWhere("userId", userId)
      .first();

    if (!studySet) {
      throw { status: 404, message: "Không tìm thấy bộ học tập" };
    }

    const flashcards = await Flashcards.query()
      .where("studySetId", id)
      .select('id', 'mediaId');

    const mediaIds = flashcards
      .map(f => f.mediaId)
      .filter(Boolean) as string[];

    await Promise.all([
      StudySets.query()
        .where("id", id)
        .andWhere("userId", userId)
        .patch({ status: "inactive" }),
      
      Flashcards.query()
        .where("studySetId", id)
        .patch({ status: "inactive" }),
      
      mediaIds.length > 0 
        ? Media.query()
            .whereIn("id", mediaIds)
            .patch({ status: "inactive" })
        : Promise.resolve()
    ]);
  }

  async copyStudySet(studySetId: string, userId: string, type: "CLONE" | "DUPLICATE") {
    const existingStudySet = await StudySets.query()
      .where("id", studySetId)
      .andWhere("status", "active")
      .first();

    if (!existingStudySet) {
      throw { status: 404, message: "Không tìm thấy bộ học tập để sao chép" };
    }

    if (existingStudySet.type === "QUIZLET") {
      throw { status: 400, message: "Không thể sao chép bộ học tập từ Quizlet" };
    }

    if (existingStudySet.userId !== userId && type === "DUPLICATE") {
      throw { status: 403, message: "Bạn không có quyền nhân bản bộ học tập này" };
    }

    if (existingStudySet.userId === userId && type === "CLONE") {
      throw { status: 400, message: "Bạn không thể sao chép bộ học tập của chính mình" };
    }

    if (existingStudySet.isPublic === false && type === "CLONE") {
      throw { status: 403, message: "Bạn không có quyền sao chép bộ học tập riêng tư" };
    }
    
    let copyStudySet = null;

    await StudySets.transaction(async (trx) => {
      const clonedStudySet = await StudySets.query(trx).insert({
        userId,
        title: `${existingStudySet.title} (${type === "CLONE" ? "Sao chép" : "Nhân bản"})`,
        description: existingStudySet.description,
        icon: existingStudySet.icon,
        topicId: existingStudySet.topicId,
        isPublic: false,
        numberOfFlashcards: existingStudySet.numberOfFlashcards,
        fromStudySetId: existingStudySet.id,
        type: type,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      copyStudySet = clonedStudySet;

      const flashcards = await Flashcards.query(trx)
        .where("studySetId", existingStudySet.id);

      await Promise.all(
        flashcards.map(async (flashcard) => {
          await Flashcards.query(trx).insert({
            studySetId: clonedStudySet.id,
            mediaId: flashcard.mediaId,
            position: flashcard.position,
            term: flashcard.term,
            definition: flashcard.definition,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        })
      );

      // Create stats entry for the cloned study set
      await StudySetStats.query(trx).insert({
        studySetId: clonedStudySet.id,
        views: 0,
        favorites: 0,
        clones: 0,
        shares: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Increment clone count for the original study set
      await StudySetStats.query(trx)
        .where("studySetId", existingStudySet.id)
        .increment("clones", 1);

      return clonedStudySet;
    });

    return copyStudySet;
  }
}

export default new StudySetService();
