import { Request, Response } from "express";
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
}

export default new AuthController();
