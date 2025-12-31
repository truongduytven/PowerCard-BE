// Types defined in types.d.ts
import { Request, Response } from 'express';
import mediaController from '../../controllers/mediaController';
import mediaService from '../../services/mediaService';

jest.mock('../../services/mediaService');

describe('MediaController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      query: {},
      user: { id: 'user-123' },
      file: undefined,
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('uploadMedia', () => {
    it('should upload media file', async () => {
      const mockFile = { filename: 'test.jpg' } as Express.Multer.File;
      mockRequest.file = mockFile;
      const mockResult = { url: 'https://example.com/test.jpg', id: 'media-1' };
      (mediaService.uploadMedia as jest.Mock).mockResolvedValue(mockResult);

      await mediaController.uploadMedia(mockRequest as Request, mockResponse as Response);

      expect(mediaService.uploadMedia).toHaveBeenCalledWith('user-123', mockFile);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 if no file provided', async () => {
      mockRequest.file = undefined;

      await mediaController.uploadMedia(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Chưa có file được tải lên' });
    });

    it('should handle upload errors', async () => {
      mockRequest.file = { filename: 'test.jpg' } as Express.Multer.File;
      (mediaService.uploadMedia as jest.Mock).mockRejectedValue({
        status: 500,
        message: 'Upload failed',
      });

      await mediaController.uploadMedia(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getMediaList', () => {
    it('should return media list without search', async () => {
      const mockMedia = [{ id: '1', url: 'url1' }, { id: '2', url: 'url2' }];
      (mediaService.getMediaList as jest.Mock).mockResolvedValue(mockMedia);

      await mediaController.getMediaList(mockRequest as Request, mockResponse as Response);

      expect(mediaService.getMediaList).toHaveBeenCalledWith(undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return media list with search query', async () => {
      mockRequest.query = { search: 'test' };
      const mockMedia = [{ id: '1', url: 'test-url' }];
      (mediaService.getMediaList as jest.Mock).mockResolvedValue(mockMedia);

      await mediaController.getMediaList(mockRequest as Request, mockResponse as Response);

      expect(mediaService.getMediaList).toHaveBeenCalledWith('test');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors', async () => {
      (mediaService.getMediaList as jest.Mock).mockRejectedValue({
        status: 500,
        message: 'Server error',
      });

      await mediaController.getMediaList(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});
