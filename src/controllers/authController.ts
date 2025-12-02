import { Request, Response } from "express";
import Users from "../models/Users";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_TTL = '24h';

//checkformat email 
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Tất cả các trường đều bắt buộc" });
      }

      const user = await Users.query()
        .where("email", email as string)
        .first();
      
      if (!user) {
        return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
      }

      if (!user.status || user.status !== 'active') {
        return res.status(403).json({ message: "Tài khoản của bạn không được phép đăng nhập" });
      }
      
      const isPasswordValid = await bcrypt.compare(password as string, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
      }

      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: ACCESS_TOKEN_TTL }
      );

      return res.status(200).json({ accessToken, expiresAt: ACCESS_TOKEN_TTL });
    } catch (error) {
      console.error("Login error:", error);
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

      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Email không hợp lệ" });
      }

      const existingUser = await Users.query().where("email", email as string).first();
      if (existingUser) {
        return res
          .status(409)
          .json({ message: "Email đã được sử dụng" });
      }

      const hashedPassword = await bcrypt.hash(password as string, 10);
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email)}`

      await Users.query().insert({
        email,
        password: hashedPassword,
        username: name,
        avatarUrl,
        avatarId: '',
        role: 'user',
        status: 'active'
      });

      return res.status(201).json({ message: "Đăng ký thành công" });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      const { id, ...user } = (req as any).user;
      return res.status(200).json({ user });
    } catch (error) {
      console.error("GetMe error:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
  }
}

export default new AuthController();
