import { Request, Response } from "express";
import studyService from "../services/studyService";

class StudyController {
  async getStudyCard(req: Request, res: Response) {
    try {
      const { userLearnId, page, pageSize } = req.query;
      const { id } = (req as any).user;

      if (!userLearnId || !page || !pageSize) {
        return res
          .status(400)
          .json({ message: "userLearnId, page và pageSize là bắt buộc" });
      }

      const result = await studyService.getStudyData(
        id,
        userLearnId as string,
        Number(page),
        Number(pageSize)
      );
      return res.status(200).json({ message: 'Lấy thẻ học thành công', data: result });
    } catch (error) {
      console.error("GetStudyCard error:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async startStudy(req: Request, res: Response) {
    try {
      const { studySetId } = req.body;
      const { id } = (req as any).user;

      if (!studySetId) {
        return res
          .status(400)
          .json({ message: "studySetId là bắt buộc" });
      }

      const result = await studyService.startStudy(
        id,
        studySetId as string
      );
      return res.status(200).json({ message: 'Bắt đầu học thành công', data: result });
    } catch (error) {
      console.error("StartStudy error:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }
}

export default new StudyController();