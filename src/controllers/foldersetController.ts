import { Request, Response } from "express";
import FolderSets from "../models/FolderSets";
import StudySets from "../models/StudySets";

class foldersetController {
  async getAllFolderSets(req: Request, res: Response) {
    try {
      const result = await FolderSets.query()
        .where("userId", (req as any).user.id)
        .where("status", "active")
        .select("id", "title", "description", "number_of_study_sets");

      res.status(200).json({ message: "Lấy tất cả bộ thư mục thành công", data: result });
    } catch (error) {
      console.error("Error fetching folder sets:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async getFolderSetById(req: Request, res: Response) {
    try {
      const folderSetId = req.params.id;

      const folderSet = await FolderSets.query()
        .where("id", folderSetId)
        .andWhere("userId", (req as any).user.id)
        .andWhere("status", "active")
        .first();

      if (!folderSet) {
        return res.status(404).json({ message: "Không tìm thấy bộ thư mục" });
      }

      const studySets = await StudySets.query()
        .alias("ss")
        .innerJoin("folder_study_sets as fss", "ss.id", "fss.study_set_id")
        .innerJoin("users", "ss.userId", "users.id")
        .where("fss.folder_set_id", folderSetId)
        .andWhere("fss.status", "active")
        .select(
          "ss.id",
          "ss.title",
          "ss.description",
          "ss.is_public",
          "users.username",
          "users.avatar_url",
          "ss.number_of_flashcards",
          "ss.created_at",
          "ss.updated_at"
        );

      const result = {
        id: folderSet.id,
        title: folderSet.title,
        description: folderSet.description,
        studySets: studySets,
      };

      res.status(200).json({ message: "Lấy thông tin bộ thư mục thành công", data: result });
    } catch (error) {
      console.error("Error fetching folder set by ID:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }
}

export default new foldersetController();
