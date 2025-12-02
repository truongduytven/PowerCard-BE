import { Request, Response } from "express";
import Topics from "../models/Topics";

class TopicController {
  async getTopics(req: Request, res: Response) {
    try {
      const result = await Topics.query().where("status", "active");

      res.status(200).json({ message: "Lấy danh sách chủ đề thành công", data: result });
    } catch (error: any) {
      console.error("Error fetching topics:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }
}

export default new TopicController();