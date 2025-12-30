import { Request, Response } from "express";
import Users from "../models/Users";
import cloudinary from "../configs/cloudinary";
import authService from "../services/authService";
class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Tất cả các trường đều bắt buộc" });
      }

      const result = await authService.login(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res
          .status(400)
          .json({ message: "Tất cả các trường đều bắt buộc" });
      }

      const result = await authService.register(email, password, name);
      return res.status(201).json(result);
    } catch (error: any) {
      console.error("Register error:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const result = await authService.getMe(userId);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("GetMe error:", error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async uploadAvatar(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      if (!req.file) {
        return res.status(400).json({ message: "Chưa có file được tải lên" });
      }
      
      const user = await Users.query().findById(userId);
      if (user && user.avatarId) {
        await cloudinary.uploader.destroy(user.avatarId);
      }

      const uploadAvatar = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `PowerCard/avatars`,
            transformation: [
              { width: 400, height: 400, crop: 'limit' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file?.buffer);
      })

      await Users.query().where("id", userId).update({
        avatarUrl: uploadAvatar.secure_url,
        avatarId: uploadAvatar.public_id
      });
      return res.status(200).json({ message: "Tải lên ảnh đại diện thành công", avatarUrl: uploadAvatar.secure_url });
    } catch (error) {
      console.error("Upload avatar error:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await authService.getAllUsers();
      return res.status(200).json({ message: "Lấy danh sách người dùng thành công", data: users });
    } catch (error: any) {
      console.error("GetAllUsers error:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }
}

export default new AuthController();
