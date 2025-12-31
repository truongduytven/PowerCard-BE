// Types defined in types.d.ts
import { Request, Response } from 'express';
import topicController from '../../controllers/topicController';
import topicService from '../../services/topicService';

jest.mock('../../services/topicService');

describe('TopicController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getTopics', () => {
    it('should return all topics', async () => {
      const mockTopics = [
        { id: '1', name: 'Topic 1' },
        { id: '2', name: 'Topic 2' },
      ];
      (topicService.getTopics as jest.Mock).mockResolvedValue(mockTopics);

      await topicController.getTopics(mockRequest as Request, mockResponse as Response);

      expect(topicService.getTopics).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Lấy danh sách chủ đề thành công',
        data: mockTopics,
      });
    });

    it('should handle errors', async () => {
      (topicService.getTopics as jest.Mock).mockRejectedValue({
        status: 500,
        message: 'Server error',
      });

      await topicController.getTopics(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});
