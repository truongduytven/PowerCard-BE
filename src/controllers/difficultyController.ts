import { Request, Response } from "express";
import difficultyService from "../services/difficultyService";

interface IDifficultyConfig {
  userLearnId: string;
  difficulties: {
    name: string;
    minutes: number;
  }[];
}

class DifficultyController {
  async configureDifficulty(req: Request, res: Response) {
    try {
      const { userLearnId, difficulties } = req.body as IDifficultyConfig;

      if (!userLearnId || !difficulties || !Array.isArray(difficulties) || difficulties.length === 0) {
        return res
          .status(400)
          .json({ message: "userLearnId và difficulties là bắt buộc" });
      }

      const result = await difficultyService.configureDifficulties(
        { userLearnId, difficulties }
      );
      return res.status(200).json({ message: 'Cấu hình độ khó thành công', data: result });
    } catch (error) {
      console.error("ConfigureDifficulty error:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async getDifficultyConfig(req: Request, res: Response) {
    try {
      const { userLearnId } = req.query;

      if (!userLearnId) {
        return res
          .status(400)
          .json({ message: "userLearnId là bắt buộc" });
      }

      const result = await difficultyService.getDifficultiesConfig(
        userLearnId as string
      );
      return res.status(200).json({ message: 'Lấy cấu hình độ khó thành công', data: result });
    } catch (error) {
      console.error("GetDifficultyConfig error:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }
}

export default new DifficultyController();