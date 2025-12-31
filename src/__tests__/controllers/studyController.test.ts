// Types defined in types.d.ts
import { Request, Response } from 'express';
import studyController from '../../controllers/studyController';
import studyService from '../../services/studyService';

jest.mock('../../services/studyService');

describe('StudyController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {},
      cookies: {},
      user: { id: 'user-123' },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('startStudySession', () => {
    it('should start a new study session', async () => {
      mockRequest.body = { studySetId: 'set-1' };
      const mockSession = { sessionId: 'session-123', cards: [] };
      (studyService.startStudySession as jest.Mock).mockResolvedValue(mockSession);

      await studyController.startStudySession(mockRequest as Request, mockResponse as Response);

      expect(studyService.startStudySession).toHaveBeenCalledWith('user-123', 'set-1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors', async () => {
      mockRequest.body = { studySetId: 'set-1' };
      (studyService.startStudySession as jest.Mock).mockRejectedValue({
        status: 404,
        message: 'Study set not found',
      });

      await studyController.startStudySession(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Study set not found' });
    });
  });

  describe('getStudyCards', () => {
    it('should return study cards for session', async () => {
      mockRequest.cookies = { study_session: 'session-123' };
      mockRequest.query = { direction: 'next', limit: '10' };
      const mockCards = [{ id: 'card-1' }, { id: 'card-2' }];
      (studyService.getStudyCards as jest.Mock).mockResolvedValue(mockCards);

      await studyController.getStudyCards(mockRequest as Request, mockResponse as Response);

      expect(studyService.getStudyCards).toHaveBeenCalledWith('session-123', 'next', 10);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should use default values for optional params', async () => {
      mockRequest.cookies = { study_session: 'session-123' };
      mockRequest.query = {};
      (studyService.getStudyCards as jest.Mock).mockResolvedValue([]);

      await studyController.getStudyCards(mockRequest as Request, mockResponse as Response);

      expect(studyService.getStudyCards).toHaveBeenCalledWith('session-123', 'next', 10);
    });
  });
});
