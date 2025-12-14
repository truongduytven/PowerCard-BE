import { Request, Response } from "express";
import topicService from "../services/topicService";

class TopicController {
  async getTopics(req: Request, res: Response) {
    try {
      const result = await topicService.getTopics();
      res.status(200).json({ message: "Lấy danh sách chủ đề thành công", data: result });
    } catch (error: any) {
      console.error("Error fetching topics:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }
}

export default new TopicController();