import jwt from 'jsonwebtoken';
import User from '../models/Users';

export const protectedRoute = async (req: any, res: any, next: any) => {
  try {
    // get access token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
      return res.status(401).json({ message: 'Không có quyền truy cập' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, async (err: any, decodedUser: any) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token đã hết hạn' });
        }

        if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ message: 'Token không hợp lệ' });
        }

        return res.status(403).json({ message: 'Không có quyền truy cập' });
      }

      const user = await User.query().findById(decodedUser.userId);

      if (!user || user.status !== 'active') {
        return res.status(403).json({ message: 'Tài khoản của bạn không được phép truy cập' });
      }
      
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }
      const { password, status, ...data } = user || {};
      
      req.user = data;
      
      next();
    });
  } catch (error) {
    console.error("Error in auth middleware: ", error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ' });
  }
};