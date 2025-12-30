import { Request, Response } from "express";
import foldersetService from "../services/foldersetService";

class FoldersetController {
  async getAllFolderSets(req: Request, res: Response) {
    try {
      const result = await foldersetService.getAllFolderSets((req as any).user.id);
      res.status(200).json({ message: "Lấy tất cả bộ thư mục thành công", data: result });
    } catch (error: any) {
      console.error("Error fetching folder sets:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async getFolderSetById(req: Request, res: Response) {
    try {
      const folderSetId = req.params.id;
      const result = await foldersetService.getFolderSetById(folderSetId, (req as any).user.id);
      res.status(200).json({ message: "Lấy thông tin bộ thư mục thành công", data: result });
    } catch (error: any) {
      console.error("Error fetching folder set by ID:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async createFolderSet(req: Request, res: Response) {
    try {
      const { title, description, icon, studySets } = req.body;
      const userId = (req as any).user.id;

      const newFolderSet = await foldersetService.createFolderSet(userId, title, description, icon, studySets);
      res.status(201).json({ message: "Tạo bộ thư mục thành công", data: newFolderSet });
    } catch (error: any) {
      console.error("Error creating folder set:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }
  
  async updateFolderSet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, studySets, icon } = req.body;
      const userId = (req as any).user.id;

      await foldersetService.updateFolderSet(id, userId, title, description, studySets, icon);
      res.status(200).json({ message: "Cập nhật bộ thư mục thành công" });
    } catch (error: any) {
      console.error("Error updating folder set:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async deleteFolderSet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      await foldersetService.deleteFolderSet(id, userId);
      res.status(200).json({ message: "Xóa bộ thư mục thành công" });
    } catch (error: any) {
      console.error("Error deleting folder set:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }
}

export default new FoldersetController();
