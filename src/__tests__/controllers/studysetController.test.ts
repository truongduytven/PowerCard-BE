// Types defined in types.d.ts
import { Request, Response } from 'express';
import studysetController from '../../controllers/studysetController';
import studysetService from '../../services/studysetService';
import interactionService from '../../services/interactionService';
import testService from '../../services/testService';

jest.mock('../../services/studysetService');
jest.mock('../../services/interactionService');
jest.mock('../../services/testService');

describe('StudysetController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {},
      user: { id: 'user-123' },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getMyStudySets', () => {
    it('should return user study sets', async () => {
      const mockData = [{ id: '1', title: 'Set 1' }];
      (studysetService.getMyStudySets as jest.Mock).mockResolvedValue(mockData);

      await studysetController.getMyStudySets(mockRequest as Request, mockResponse as Response);

      expect(studysetService.getMyStudySets).toHaveBeenCalledWith('user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getLearningStudySets', () => {
    it('should return learning study sets', async () => {
      const mockData = [{ id: '1', title: 'Learning Set' }];
      (studysetService.getLearningStudySets as jest.Mock).mockResolvedValue(mockData);

      await studysetController.getLearningStudySets(mockRequest as Request, mockResponse as Response);

      expect(studysetService.getLearningStudySets).toHaveBeenCalledWith('user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getPublicStudySets', () => {
    it('should return public study sets with pagination', async () => {
      mockRequest.query = { page: '1', limit: '10', search: 'test' };
      const mockData = { studySets: [], pagination: {} };
      (studysetService.getPublicStudySets as jest.Mock).mockResolvedValue(mockData);

      await studysetController.getPublicStudySets(mockRequest as Request, mockResponse as Response);

      expect(studysetService.getPublicStudySets).toHaveBeenCalledWith('user-123', 1, 10, 'test', undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getStudySetById', () => {
    it('should return study set by id', async () => {
      mockRequest.params = { id: 'set-1' };
      const mockData = { id: 'set-1', title: 'Set 1' };
      (studysetService.getStudySetById as jest.Mock).mockResolvedValue(mockData);

      await studysetController.getStudySetById(mockRequest as Request, mockResponse as Response);

      expect(studysetService.getStudySetById).toHaveBeenCalledWith('set-1', 'user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('createStudySet', () => {
    it('should create new study set', async () => {
      mockRequest.body = { title: 'New Set', description: 'Desc', topicId: 'topic-1' };
      const mockResult = { id: 'new-set-id' };
      (studysetService.createStudySet as jest.Mock).mockResolvedValue(mockResult);

      await studysetController.createStudySet(mockRequest as Request, mockResponse as Response);

      expect(studysetService.createStudySet).toHaveBeenCalledWith('user-123', mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updateStudySet', () => {
    it('should update study set', async () => {
      mockRequest.params = { id: 'set-1' };
      mockRequest.body = { title: 'Updated Set' };
      (studysetService.updateStudySet as jest.Mock).mockResolvedValue(undefined);

      await studysetController.updateStudySet(mockRequest as Request, mockResponse as Response);

      expect(studysetService.updateStudySet).toHaveBeenCalledWith('set-1', 'user-123', mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteStudySet', () => {
    it('should delete study set', async () => {
      mockRequest.params = { id: 'set-1' };
      (studysetService.deleteStudySet as jest.Mock).mockResolvedValue(undefined);

      await studysetController.deleteStudySet(mockRequest as Request, mockResponse as Response);

      expect(studysetService.deleteStudySet).toHaveBeenCalledWith('set-1', 'user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('addFavorite', () => {
    it('should add study set to favorites', async () => {
      mockRequest.params = { id: 'set-1' };
      (interactionService.addFavorite as jest.Mock).mockResolvedValue(undefined);

      await studysetController.addFavorite(mockRequest as Request, mockResponse as Response);

      expect(interactionService.addFavorite).toHaveBeenCalledWith('set-1', 'user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('removeFavorite', () => {
    it('should remove study set from favorites', async () => {
      mockRequest.params = { id: 'set-1' };
      (interactionService.removeFavorite as jest.Mock).mockResolvedValue(undefined);

      await studysetController.removeFavorite(mockRequest as Request, mockResponse as Response);

      expect(interactionService.removeFavorite).toHaveBeenCalledWith('set-1', 'user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('cloneStudySet', () => {
    it('should clone study set', async () => {
      mockRequest.params = { id: 'set-1' };
      const mockResult = { id: 'cloned-set-id' };
      (studysetService.copyStudySet as jest.Mock).mockResolvedValue(mockResult);

      await studysetController.cloneStudySet(mockRequest as Request, mockResponse as Response);

      expect(studysetService.copyStudySet).toHaveBeenCalledWith('set-1', 'user-123', 'CLONE');
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
  });

  describe('duplicateStudySet', () => {
    it('should duplicate study set', async () => {
      mockRequest.params = { id: 'set-1' };
      const mockResult = { id: 'duplicated-set-id' };
      (studysetService.copyStudySet as jest.Mock).mockResolvedValue(mockResult);

      await studysetController.duplicateStudySet(mockRequest as Request, mockResponse as Response);

      expect(studysetService.copyStudySet).toHaveBeenCalledWith('set-1', 'user-123', 'DUPLICATE');
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
  });

  describe('generateTest', () => {
    it('should generate test from study set', async () => {
      mockRequest.params = { id: 'set-1' };
      mockRequest.query = { limit: '20' };
      const mockTest = { questions: [] };
      (testService.generateTest as jest.Mock).mockResolvedValue(mockTest);

      await studysetController.generateTest(mockRequest as Request, mockResponse as Response);

      expect(testService.generateTest).toHaveBeenCalledWith('set-1', 20);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });
});
