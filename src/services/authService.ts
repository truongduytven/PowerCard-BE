import Users from "../models/Users";
import UserLogs from "../models/UserLog";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_TTL = '24h';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class AuthService {
  async login(email: string, password: string) {
    const user = await Users.query()
      .where("email", email)
      .first();
    
    if (!user) {
      throw { status: 401, message: "Email hoặc mật khẩu không đúng" };
    }

    if (!user.status || user.status !== 'active') {
      throw { status: 403, message: "Tài khoản của bạn không được phép đăng nhập" };
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw { status: 401, message: "Email hoặc mật khẩu không đúng" };
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    return { accessToken, expiresAt: ACCESS_TOKEN_TTL };
  }

  async updateLoginStreaks(userId: string) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get or create user log
    let userLog = await UserLogs.query().where('userId', userId).first();

    if (!userLog) {
      // First time login - create new log
      await UserLogs.query().insert({
        userId,
        recordStreaks: 1,
        longestStreaks: 1,
        lastLoginAt: now.toISOString(),
      });
      return;
    }

    // Check if already logged in today
    if (userLog.lastLoginAt) {
      const lastLoginDate = new Date(userLog.lastLoginAt);
      const lastLoginDay = new Date(
        lastLoginDate.getFullYear(),
        lastLoginDate.getMonth(),
        lastLoginDate.getDate()
      );

      // Already logged in today - no update needed
      if (lastLoginDay.getTime() === today.getTime()) {
        return;
      }

      // Check if yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let newStreaks: number;
      if (lastLoginDay.getTime() === yesterday.getTime()) {
        // Consecutive day - increment streak
        newStreaks = userLog.recordStreaks + 1;
      } else {
        // Streak broken - reset to 1
        newStreaks = 1;
      }

      // Update longest streak if needed
      const newLongestStreaks = Math.max(userLog.longestStreaks, newStreaks);

      await UserLogs.query()
        .where('id', userLog.id)
        .patch({
          recordStreaks: newStreaks,
          longestStreaks: newLongestStreaks,
          lastLoginAt: now.toISOString(),
        });
    } else {
      // lastLoginAt is null - reset streak
      await UserLogs.query()
        .where('id', userLog.id)
        .patch({
          recordStreaks: 1,
          longestStreaks: Math.max(userLog.longestStreaks, 1),
          lastLoginAt: now.toISOString(),
        });
    }
  }

  async register(email: string, password: string, name: string) {
    if (!emailRegex.test(email)) {
      throw { status: 400, message: "Email không hợp lệ" };
    }

    const existingUser = await Users.query().where("email", email).first();
    if (existingUser) {
      throw { status: 409, message: "Email đã được sử dụng" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email)}`

    const newUser = await Users.query().insertAndFetch({
      email,
      password: hashedPassword,
      username: name,
      avatarUrl,
      avatarId: '',
      role: 'user',
      status: 'active'
    });

    // Create initial user log entry
    await UserLogs.query().insert({
      userId: newUser.id,
      recordStreaks: 0,
      longestStreaks: 0,
      lastLoginAt: null,
    });

    return { message: "Đăng ký thành công" };
  }

  async getMe(userId: string) {
    const user = await Users.query()
      .findById(userId)
      .select('id', 'username', 'email', 'role', 'status', 'avatarUrl', 'avatarId', 'createdAt', 'updatedAt');

    if (!user) {
      throw { status: 404, message: "Không tìm thấy người dùng" };
    }

    // Update login streaks
    await this.updateLoginStreaks(user.id);
    // Get user logs
    const userLog = await UserLogs.query().where('userId', userId).first();

    // Convert lastLoginAt to UTC+7
    let lastLoginAtVN = null;
    if (userLog && userLog.lastLoginAt) {
      const date = new Date(userLog.lastLoginAt);
      date.setHours(date.getHours() + 7);
      lastLoginAtVN = date.toISOString();
    }

    return {
      user: {
        ...user,
        streaks: userLog ? {
          recordStreaks: userLog.recordStreaks,
          longestStreaks: userLog.longestStreaks,
          lastLoginAt: lastLoginAtVN,
        } : {
          recordStreaks: 0,
          longestStreaks: 0,
          lastLoginAt: null,
        }
      }
    };
  }
}

export default new AuthService();
