import { Request, Response } from "express";
import FolderSets from "../models/FolderSets";
import StudySets from "../models/StudySets";
import FolderStudySets from "../models/FolderStudySets";

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
        .innerJoin("topics", "ss.topicId", "topics.id")
        .where("fss.folder_set_id", folderSetId)
        .andWhere("fss.status", "active")
        .select(
          "ss.id",
          "ss.title",
          "ss.description",
          "topics.name as topic_name",
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

  async createFolderSet(req: Request, res: Response) {
    try {
      const { title, description, studySets } = req.body;
      const userId = (req as any).user.id;

      if (!title || !description || !Array.isArray(studySets)) {
        return res.status(400).json({ message: "Yêu cầu không hợp lệ" });
      }

      const newFolderSet = await FolderSets.query().insert({
        userId,
        title,
        description,
        numberOfStudySets: studySets.length || 0,
        status: "active",
      })

      await Promise.all(studySets.map((studySetId: string) => 
        FolderStudySets.query().insert({
          folderSetId: newFolderSet.id,
          studySetId,
          status: "active",
        })
      ));

      res.status(201).json({ message: "Tạo bộ thư mục thành công", data: newFolderSet });
    } catch (error) {
      console.error("Error creating folder set:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }
  
  async updateFolderSet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, studySets } = req.body;
      const userId = (req as any).user.id;

      const folderSet = await FolderSets.query()
        .where("id", id)
        .andWhere("userId", userId)
        .andWhere("status", "active")
        .first();

      if (!folderSet) {
        return res.status(404).json({ message: "Không tìm thấy bộ thư mục" });
      }

      await FolderSets.transaction(async (trx) => {
        await FolderSets.query(trx).patchAndFetchById(id, {
          title: title || folderSet.title,
          description: description || folderSet.description,
          numberOfStudySets: studySets?.length || folderSet.numberOfStudySets,
        });

        if (Array.isArray(studySets)) {
          const existingRelations = await FolderStudySets.query(trx)
            .where("folderSetId", id);

          const activeRelations = existingRelations.filter((rel) => rel.status === "active");
          const inactiveRelations = existingRelations.filter((rel) => rel.status === "inactive");
          const activeStudySetIds = activeRelations.map((rel) => rel.studySetId);
          const inactiveStudySetIds = inactiveRelations.map((rel) => rel.studySetId);
          const newStudySetIds = studySets as string[];

          const toReactivate = newStudySetIds.filter(
            (studySetId) => inactiveStudySetIds.includes(studySetId)
          );
          const toAdd = newStudySetIds.filter(
            (studySetId) => !activeStudySetIds.includes(studySetId) && !inactiveStudySetIds.includes(studySetId)
          );
          const toDeactivate = activeStudySetIds.filter(
            (studySetId) => !newStudySetIds.includes(studySetId)
          );

          if (toReactivate.length > 0) {
            await FolderStudySets.query(trx)
              .whereIn("studySetId", toReactivate)
              .andWhere("folderSetId", id)
              .patch({ status: "active" });
          }

          if (toAdd.length > 0) {
            await Promise.all(
              toAdd.map((studySetId) =>
                FolderStudySets.query(trx).insert({
                  folderSetId: id,
                  studySetId,
                  status: "active",
                })
              )
            );
          }

          if (toDeactivate.length > 0) {
            await FolderStudySets.query(trx)
              .whereIn("studySetId", toDeactivate)
              .andWhere("folderSetId", id)
              .patch({ status: "inactive" });
          }
        }
      });

      res.status(200).json({ message: "Cập nhật bộ thư mục thành công" });
    } catch (error) {
      console.error("Error updating folder set:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async deleteFolderSet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const folderSet = await FolderSets.query()
        .where("id", id)
        .andWhere("userId", userId)
        .andWhere("status", "active")
        .first();

      if (!folderSet) {
        return res.status(404).json({ message: "Không tìm thấy bộ thư mục" });
      }

      await FolderSets.query()
        .where("id", id)
        .patch({ status: "inactive" });


      res.status(200).json({ message: "Xóa bộ thư mục thành công" });
    } catch (error) {
      console.error("Error deleting folder set:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }
}

export default new foldersetController();
