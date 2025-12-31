// Types defined in types.d.ts
import { Request, Response } from 'express';
import authController from '../../controllers/authController';
import authService from '../../services/authService';

jest.mock('../../services/authService');
jest.mock('../../configs/cloudinary');

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {},
      user: { id: 'user-123' },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return 200 and token on successful login', async () => {
      mockRequest.body = { email: 'test@test.com', password: 'password123' };
      const mockResult = { accessToken: 'token123', user: { id: 'user-123', email: 'test@test.com' } };
      (authService.login as jest.Mock).mockResolvedValue(mockResult);

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(authService.login).toHaveBeenCalledWith('test@test.com', 'password123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 400 if email or password is missing', async () => {
      mockRequest.body = { email: 'test@test.com' };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Tất cả các trường đều bắt buộc' });
    });

    it('should return error status when login fails', async () => {
      mockRequest.body = { email: 'test@test.com', password: 'wrong' };
      (authService.login as jest.Mock).mockRejectedValue({ status: 401, message: 'Invalid credentials' });

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });

  describe('register', () => {
    it('should return 201 on successful registration', async () => {
      mockRequest.body = { email: 'test@test.com', password: 'password123', name: 'Test User' };
      const mockResult = { user: { id: 'new-user-id' } };
      (authService.register as jest.Mock).mockResolvedValue(mockResult);

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(authService.register).toHaveBeenCalledWith('test@test.com', 'password123', 'Test User');
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 400 if required fields are missing', async () => {
      mockRequest.body = { email: 'test@test.com' };

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return error status when registration fails', async () => {
      mockRequest.body = { email: 'test@test.com', password: 'password123', name: 'Test' };
      (authService.register as jest.Mock).mockRejectedValue({ status: 409, message: 'User exists' });

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
    });
  });

  describe('getMe', () => {
    it('should return user info', async () => {
      const mockUser = { id: 'user-123', email: 'test@test.com', name: 'Test User' };
      (authService.getMe as jest.Mock).mockResolvedValue(mockUser);

      await authController.getMe(mockRequest as Request, mockResponse as Response);

      expect(authService.getMe).toHaveBeenCalledWith('user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });
});
