import { Request, Response } from "express";
import StudySets from "../models/StudySets";

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
        .innerJoin('users', 'ss.userId', 'users.id')
        .select(
          "ss.id",
          "ss.title",
          "ss.description",
          "users.username",
          "users.avatar_url",
          "ss.is_public",
          "ss.number_of_flashcards",
          "ss.created_at",
          "ss.updated_at"
        );
      
      res.status(200).json({ message: "Lấy danh sách bộ học tập thành công", data: studySets });
    } catch (error) {
      console.error("Error fetching study sets:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }
}

export default new studysetController();
