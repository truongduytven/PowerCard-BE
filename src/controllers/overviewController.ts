import { Request, Response } from "express";
import overviewService from "../services/overviewService";

class OverviewController {
  async getOverviewBlock(req: Request, res: Response) {
    try {
      const { id } = (req as any).user;

      const result = await overviewService.getOverviewBlock(id);

      return res.status(200).json({
        message: 'Lấy thông tin overview thành công',
        data: result
      });
    } catch (error: any) {
      console.error("GetOverviewBlock error:", error);
      return res.status(500).json({ message: error.message || "Đã xảy ra lỗi máy chủ" });
    }
  }

  async getLearningProgress(req: Request, res: Response) {
    try {
      const { id } = (req as any).user;

      const result = await overviewService.getLearningProgress(id);

      return res.status(200).json({
        message: 'Lấy tiến độ học tập thành công',
        data: result
      });
    } catch (error: any) {
      console.error("GetLearningProgress error:", error);
      return res.status(500).json({ message: error.message || "Đã xảy ra lỗi máy chủ" });
    }
  }

  async getLearningInsights(req: Request, res: Response) {
    try {
      const { id } = (req as any).user;

      const result = await overviewService.getLearningInsights(id);

      return res.status(200).json({
        message: 'Lấy phân tích học tập thành công',
        data: result
      });
    } catch (error: any) {
      console.error("GetLearningInsights error:", error);
      return res.status(500).json({ message: error.message || "Đã xảy ra lỗi máy chủ" });
    }
  }

  async getWeeklyActivity(req: Request, res: Response) {
    try {
      const { id } = (req as any).user;

      const result = await overviewService.getWeeklyActivity(id);

      return res.status(200).json({
        message: 'Lấy hoạt động học tập tuần thành công',
        data: result
      });
    } catch (error: any) {
      console.error("GetWeeklyActivity error:", error);
      return res.status(500).json({ message: error.message || "Đã xảy ra lỗi máy chủ" });
    }
  }

  async getActivityHeatmap(req: Request, res: Response) {
    try {
      const { id } = (req as any).user;
      const { period = 'week' } = req.query;

      if (!['week', 'month', 'year'].includes(period as string)) {
        return res.status(400).json({ 
          message: "Period phải là 'week', 'month', hoặc 'year'" 
        });
      }

      const result = await overviewService.getActivityHeatmap(id, period as 'week' | 'month' | 'year');

      return res.status(200).json({
        message: 'Lấy heatmap hoạt động học tập thành công',
        data: result
      });
    } catch (error: any) {
      console.error("GetActivityHeatmap error:", error);
      return res.status(500).json({ message: error.message || "Đã xảy ra lỗi máy chủ" });
    }
  }

  async getDeckPerformance(req: Request, res: Response) {
    try {
      const { id } = (req as any).user;

      const result = await overviewService.getDeckPerformance(id);

      return res.status(200).json({
        message: 'Lấy deck performance thành công',
        data: result
      });
    } catch (error: any) {
      console.error("GetDeckPerformance error:", error);
      return res.status(500).json({ message: error.message || "Đã xảy ra lỗi máy chủ" });
    }
  }
}

export default new OverviewController();