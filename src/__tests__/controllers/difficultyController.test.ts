// Types defined in types.d.ts
import { Request, Response } from 'express';
import difficultyController from '../../controllers/difficultyController';
import difficultyService from '../../services/difficultyService';

jest.mock('../../services/difficultyService');

describe('DifficultyController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      user: { id: 'user-123' },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('configureDifficulty', () => {
    it('should configure difficulty settings', async () => {
      mockRequest.body = {
        userLearnId: 'learn-1',
        difficulties: [
          { name: 'AGAIN', minutes: 1 },
          { name: 'HARD', minutes: 5 },
        ],
      };
      (difficultyService.configureDifficulties as jest.Mock).mockResolvedValue(undefined);

      await difficultyController.configureDifficulty(mockRequest as Request, mockResponse as Response);

      expect(difficultyService.configureDifficulties).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Cấu hình độ khó thành công' });
    });

    it('should handle errors', async () => {
      mockRequest.body = { userLearnId: 'learn-1' };
      (difficultyService.configureDifficulties as jest.Mock).mockRejectedValue({
        status: 400,
        message: 'Invalid configuration',
      });

      await difficultyController.configureDifficulty(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getDifficultyConfig', () => {
    it('should return difficulty configuration', async () => {
      mockRequest.query = { userLearnId: 'learn-1' };
      const mockConfig = {
        againMinutes: 1,
        hardMinutes: 5,
        goodMinutes: 10,
        easyDays: 4,
      };
      (difficultyService.getDifficultiesConfig as jest.Mock).mockResolvedValue(mockConfig);

      await difficultyController.getDifficultyConfig(mockRequest as Request, mockResponse as Response);

      expect(difficultyService.getDifficultiesConfig).toHaveBeenCalledWith('learn-1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Lấy cấu hình độ khó thành công',
        data: mockConfig,
      });
    });

    it('should handle errors', async () => {
      mockRequest.query = { userLearnId: 'learn-1' };
      (difficultyService.getDifficultiesConfig as jest.Mock).mockRejectedValue({
        status: 404,
        message: 'Config not found',
      });

      await difficultyController.getDifficultyConfig(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});
