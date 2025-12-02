import { Request, Response } from "express";
import StudySets from "../models/StudySets";
import Topics from "../models/Topics";
import Flashcards from "../models/Flashcards";
import Media from "../models/Media";
import knex from "../configs/db";

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

function isUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

class studysetController {
  async getListStudySets(req: Request, res: Response) {
    try {
      const { isAuthor, isLearning } = req.query;
      const userId = (req as any).user.id;
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

      res.status(200).json({
        message: "Lấy danh sách bộ học tập thành công",
        data: studySets,
      });
    } catch (error) {
      console.error("Error fetching study sets:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async getStudySetById(req: Request, res: Response) {
    try {
      const studySetId = req.params.id;

      const studySet = await StudySets.query()
        .alias("ss")
        .innerJoin("users", "ss.userId", "users.id")
        .innerJoin("topics", "ss.topicId", "topics.id")
        .leftJoin("reviews as r", "r.study_set_id", "ss.id")
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
        )
        .first();
      
      if (!studySet) {
        return res.status(404).json({ message: "Không tìm thấy bộ học tập" });
      }

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

      const result = {
        ...studySet,
        flashcards: flashcards,
      };
      res.status(200).json({ message: "Lấy bộ học tập thành công", data: result });
    } catch (error) {
      console.error("Error fetching study set by ID:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async createStudySet(req: Request, res: Response) {
    try {
      const body = req.body as CreateStudySetBody;

      if (!body.title || !body.topicId || !Array.isArray(body.flashcards)) {
        return res.status(400).json({ message: "Yêu cầu không hợp lệ" });
      }

      const exitStudySet = await StudySets.query()
        .where("userId", (req as any).user.id)
        .andWhere("title", body.title)
        .first();

      if (exitStudySet) {
        return res
          .status(400)
          .json({ message: "Bạn đã có bộ học tập với tiêu đề này" });
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
        userId: (req as any).user.id,
        title: body.title,
        description: body.description,
        topicId: finalTopicId,
        isPublic: body.isPublic,
        numberOfFlashcards: body.flashcards.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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

      res.status(201).json({ message: "Tạo bộ học tập thành công" });
    } catch (error) {
      console.error("Error creating study set:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }
}

export default new studysetController();
