import { Request, Response } from "express";
import StudySets from "../models/StudySets";
import Topics from "../models/Topics";
import Flashcards from "../models/Flashcards";
import Media from "../models/Media";
import knex from "knex";

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
      const isAuthor = req.query.isAuthor === "true";
      const studySets = await StudySets.query()
        .alias("ss")
        .modify((queryBuilder) => {
          if (isAuthor) {
            queryBuilder.where("ss.userId", (req as any).user.id);
          } else {
            queryBuilder.whereNot("ss.userId", (req as any).user.id);
            queryBuilder.andWhere("ss.is_public", true);
          }
        })
        .innerJoin("users", "ss.userId", "users.id")
        .innerJoin("topics", "ss.topicId", "topics.id")
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
          "ss.updated_at"
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
