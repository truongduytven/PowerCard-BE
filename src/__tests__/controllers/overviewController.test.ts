// Types defined in types.d.ts
import { Request, Response } from 'express';
import overviewController from '../../controllers/overviewController';
import overviewService from '../../services/overviewService';

jest.mock('../../services/overviewService');

describe('OverviewController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      query: {},
      user: { id: 'user-123' },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getOverviewBlock', () => {
    it('should return overview block data', async () => {
      const mockData = { studySets: 10, flashcards: 100, streak: 5 };
      (overviewService.getOverviewBlock as jest.Mock).mockResolvedValue(mockData);

      await overviewController.getOverviewBlock(mockRequest as Request, mockResponse as Response);

      expect(overviewService.getOverviewBlock).toHaveBeenCalledWith('user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getLearningProgress', () => {
    it('should return learning progress', async () => {
      const mockProgress = { completed: 50, total: 100, percentage: 50 };
      (overviewService.getLearningProgress as jest.Mock).mockResolvedValue(mockProgress);

      await overviewController.getLearningProgress(mockRequest as Request, mockResponse as Response);

      expect(overviewService.getLearningProgress).toHaveBeenCalledWith('user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getWeeklyActivity', () => {
    it('should return weekly activity data', async () => {
      const mockActivity = [{ day: 'Monday', count: 5 }];
      (overviewService.getWeeklyActivity as jest.Mock).mockResolvedValue(mockActivity);

      await overviewController.getWeeklyActivity(mockRequest as Request, mockResponse as Response);

      expect(overviewService.getWeeklyActivity).toHaveBeenCalledWith('user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getActivityHeatmap', () => {
    it('should return heatmap with default period (week)', async () => {
      const mockHeatmap = [{ date: '2024-01-01', count: 10 }];
      (overviewService.getActivityHeatmap as jest.Mock).mockResolvedValue(mockHeatmap);

      await overviewController.getActivityHeatmap(mockRequest as Request, mockResponse as Response);

      expect(overviewService.getActivityHeatmap).toHaveBeenCalledWith('user-123', 'week');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return heatmap with custom period', async () => {
      mockRequest.query = { period: 'month' };
      const mockHeatmap = [{ date: '2024-01-01', count: 10 }];
      (overviewService.getActivityHeatmap as jest.Mock).mockResolvedValue(mockHeatmap);

      await overviewController.getActivityHeatmap(mockRequest as Request, mockResponse as Response);

      expect(overviewService.getActivityHeatmap).toHaveBeenCalledWith('user-123', 'month');
    });
  });

  describe('getLearningInsights', () => {
    it('should return learning insights', async () => {
      const mockInsights = { strengths: [], weaknesses: [], recommendations: [] };
      (overviewService.getLearningInsights as jest.Mock).mockResolvedValue(mockInsights);

      await overviewController.getLearningInsights(mockRequest as Request, mockResponse as Response);

      expect(overviewService.getLearningInsights).toHaveBeenCalledWith('user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getDeckPerformance', () => {
    it('should return deck performance data', async () => {
      const mockPerformance = [
        { deckId: 'deck-1', accuracy: 85, avgTime: 120 },
        { deckId: 'deck-2', accuracy: 90, avgTime: 100 },
      ];
      (overviewService.getDeckPerformance as jest.Mock).mockResolvedValue(mockPerformance);

      await overviewController.getDeckPerformance(mockRequest as Request, mockResponse as Response);

      expect(overviewService.getDeckPerformance).toHaveBeenCalledWith('user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });
});
