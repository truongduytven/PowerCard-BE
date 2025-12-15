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
}

export default new OverviewController();