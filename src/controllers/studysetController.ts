import { Request, Response } from "express";
import studysetService from "../services/studysetService";
import interactionService from "../services/interactionService";
import testService from "../services/testService";

class StudysetController {
  async getListStudySets(req: Request, res: Response) {
    try {
      const { isAuthor, isLearning } = req.query;
      const userId = (req as any).user.id;
      
      const studySets = await studysetService.getListStudySets(
        userId, 
        isAuthor as string, 
        isLearning as string
      );

      res.status(200).json({
        message: "Lấy danh sách bộ học tập thành công",
        data: studySets,
      });
    } catch (error: any) {
      console.error("Error fetching study sets:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  // Lấy studyset mà user tự tạo
  async getMyStudySets(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      const studySets = await studysetService.getMyStudySets(userId);

      res.status(200).json({
        message: "Lấy danh sách bộ học tập của tôi thành công",
        data: studySets,
      });
    } catch (error: any) {
      console.error("Error fetching my study sets:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  // Lấy studyset đang học
  async getLearningStudySets(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      const studySets = await studysetService.getLearningStudySets(userId);

      res.status(200).json({
        message: "Lấy danh sách bộ học tập đang học thành công",
        data: studySets,
      });
    } catch (error: any) {
      console.error("Error fetching learning study sets:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  // Lấy studyset public (có search và pagination)
  async getPublicStudySets(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const topicId = req.query.topicId as string;
      
      const result = await studysetService.getPublicStudySets(
        userId,
        page,
        limit,
        search,
        topicId
      );

      res.status(200).json({
        message: "Lấy danh sách bộ học tập public thành công",
        ...result,
      });
    } catch (error: any) {
      console.error("Error fetching public study sets:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async getStudySetById(req: Request, res: Response) {
    try {
      const studySetId = req.params.id;
      const userId = (req as any).user?.id || null;
      
      const result = await studysetService.getStudySetById(studySetId, userId);
      res.status(200).json({ message: "Lấy bộ học tập thành công", data: result });
    } catch (error: any) {
      console.error("Error fetching study set by ID:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async createStudySet(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      await studysetService.createStudySet(userId, req.body);
      res.status(201).json({ message: "Tạo bộ học tập thành công" });
    } catch (error: any) {
      console.error("Error creating study set:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async updateStudySet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      await studysetService.updateStudySet(id, userId, req.body);
      res.status(200).json({ message: "Cập nhật bộ học tập thành công" });
    } catch (error: any) {
      console.error("Error updating study set:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async deleteStudySet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      await studysetService.deleteStudySet(id, userId);
      res.status(200).json({ message: "Xóa bộ học tập thành công" });
    } catch (error: any) {
      console.error("Error deleting study set:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async addFavorite(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      await interactionService.addFavorite(id, userId);
      res.status(200).json({ message: "Đã thêm vào yêu thích" });
    } catch (error: any) {
      console.error("Error adding favorite:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async removeFavorite(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      await interactionService.removeFavorite(id, userId);
      res.status(200).json({ message: "Đã xóa khỏi yêu thích" });
    } catch (error: any) {
      console.error("Error removing favorite:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const stats = await interactionService.getStats(id);
      res.status(200).json({ message: "Lấy thống kê thành công", data: stats });
    } catch (error: any) {
      console.error("Error getting stats:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async generateTest(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;

      const test = await testService.generateTest(id, limit);
      res.status(200).json({ 
        message: "Tạo bài test thành công", 
        data: test 
      });
    } catch (error: any) {
      console.error("Error generating test:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async cloneStudySet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const clonedStudySet = await studysetService.copyStudySet(id, userId, "CLONE");
      res.status(201).json({ message: "Sao chép bộ học tập thành công", data: clonedStudySet });
    } catch (error: any) {
      console.error("Error cloning study set:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async duplicateStudySet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const duplicatedStudySet = await studysetService.copyStudySet(id, userId, "DUPLICATE");
      res.status(201).json({ message: "Nhân bản bộ học tập thành công", data: duplicatedStudySet });
    } catch (error: any) {
      console.error("Error duplicating study set:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }
}

export default new StudysetController();
