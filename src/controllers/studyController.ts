import { Request, Response } from "express";
import studyService from "../services/studyService";

class StudyController {
  async startStudySession(req: Request, res: Response) {
    try {
      const { studySetId } = req.body;
      const { id } = (req as any).user;

      if (!studySetId) {
        return res.status(400).json({ message: "studySetId là bắt buộc" });
      }

      const result = await studyService.startStudySession(id, studySetId);
      
      res.cookie('study_session', result.sessionId, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax',
      });

      return res.status(200).json({
        message: 'Bắt đầu phiên học thành công',
        data: {
          totalCards: result.totalCards,
          currentIndex: result.currentIndex,
          userLearnId: result.userLearnId,
        }
      });
    } catch (error: any) {
      console.error("StartStudySession error:", error);
      return res.status(500).json({ message: error.message || "Đã xảy ra lỗi máy chủ" });
    }
  }

  async getStudyCards(req: Request, res: Response) {
    try {
      const sessionId = req.cookies.study_session;
      const { direction = 'next', limit = 10 } = req.query;

      if (!sessionId) {
        return res.status(401).json({ message: "SESSION_EXPIRED" });
      }

      const result = await studyService.getStudyCards(
        sessionId,
        direction as 'next' | 'prev',
        Number(limit)
      );

      return res.status(200).json({
        message: 'Lấy thẻ học thành công',
        data: result
      });
    } catch (error: any) {
      console.error("GetStudyCards error:", error);
      if (error.status === 401) {
        res.clearCookie('study_session');
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message || "Đã xảy ra lỗi máy chủ" });
    }
  }
}

export default new StudyController();