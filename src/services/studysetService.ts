import StudySets from "../models/StudySets";
import Topics from "../models/Topics";
import Flashcards from "../models/Flashcards";
import Media from "../models/Media";
import knex from "../configs/db";
import interactionService from "./interactionService";
import StudySetStats from "../models/StudySetStats";

interface CreateStudySetBody {
  title: string;
  description: string;
  topicId: string;
  isPublic: boolean;
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
              .innerJoin("user_learns as ul", "ss.id", "ul.study_set_id")
              .where("ul.user_id", userId)
              .andWhere("ul.status", "learning")
              .select("ul.processing as processing");
          }
        }
      })
      .innerJoin("users", "ss.userId", "users.id")
      .innerJoin("topics", "ss.topicId", "topics.id")
      .leftJoin("reviews as r", "r.study_set_id", "ss.id")
      .groupBy(
        "ss.id",
        "ss.title",
        "ss.description",
        "topics.name",
        "users.username",
        "users.avatar_url",
        "ss.is_public",
        "ss.number_of_flashcards",
        "ss.created_at",
        "ss.updated_at"
      )
      .select(
        "ss.id",
        "ss.title",
        "ss.description",
        "topics.name as topic_name",
        "users.username",
        "users.avatar_url",
        "ss.is_public",
        "ss.number_of_flashcards",
        "ss.created_at",
        "ss.updated_at",
        knex.raw("COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float as avg_rating"),
        knex.raw("COUNT(r.id)::int as number_of_reviews")
      );

    return studySets;
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
        "ss.title",
        "ss.description",
        "topics.name",
        "users.username",
        "users.avatar_url",
        "ss.is_public",
        "ss.number_of_flashcards",
        "ss.created_at",
        "ss.updated_at",
        "stats.views",
        "stats.favorites",
        "stats.clones",
        "stats.shares"
      )
      .select(
        "ss.id",
        "ss.title",
        "ss.description",
        "topics.name as topic_name",
        "users.username",
        "users.avatar_url",
        "ss.is_public",
        "ss.number_of_flashcards",
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
      topicId: finalTopicId,
      isPublic: body.isPublic,
      numberOfFlashcards: body.flashcards.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

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
              .patch({ name: flashcard.term });
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
                  .patch({ name: flashcard.term });
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

    await StudySets.query()
      .where("id", id)
      .andWhere("userId", userId)
      .patch({ status: "inactive" });
  }
}

export default new StudySetService();
