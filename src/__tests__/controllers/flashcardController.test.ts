// Types defined in types.d.ts
import { Request, Response } from 'express';
import flashcardController from '../../controllers/flashcardController';
import flashcardService from '../../services/flashcardService';

jest.mock('../../services/flashcardService');

describe('FlashcardController', () => {
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

  describe('markFlashcard', () => {
    it('should mark a flashcard', async () => {
      mockRequest.body = {
        flashcardId: 'card-1',
        isMarked: true,
      };
      const mockResult = { id: 'mark-1' };
      (flashcardService.markFlashcard as jest.Mock).mockResolvedValue(mockResult);

      await flashcardController.markFlashcard(mockRequest as Request, mockResponse as Response);

      expect(flashcardService.markFlashcard).toHaveBeenCalledWith({
        userId: 'user-123',
        flashcardId: 'card-1',
        isMarked: true,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getMarkedFlashcards', () => {
    it('should return marked flashcards for a study set', async () => {
      mockRequest.params = { studySetId: 'set-1' };
      const mockCards = [{ id: 'card-1', markedType: 'important' }];
      (flashcardService.getMarkedFlashcardsByStudySet as jest.Mock).mockResolvedValue(mockCards);

      await flashcardController.getMarkedFlashcards(mockRequest as Request, mockResponse as Response);

      expect(flashcardService.getMarkedFlashcardsByStudySet).toHaveBeenCalledWith('user-123', 'set-1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteFlashcardMark', () => {
    it('should delete a flashcard mark', async () => {
      mockRequest.params = { flashcardId: 'card-1' };
      (flashcardService.deleteFlashcardMark as jest.Mock).mockResolvedValue(1);

      await flashcardController.deleteFlashcardMark(mockRequest as Request, mockResponse as Response);

      expect(flashcardService.deleteFlashcardMark).toHaveBeenCalledWith('user-123', 'card-1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getFlashcardMarkStatus', () => {
    it('should return mark status as true', async () => {
      mockRequest.params = { flashcardId: 'card-1' };
      (flashcardService.getFlashcardMarkStatus as jest.Mock).mockResolvedValue(true);

      await flashcardController.getFlashcardMarkStatus(mockRequest as Request, mockResponse as Response);

      expect(flashcardService.getFlashcardMarkStatus).toHaveBeenCalledWith('user-123', 'card-1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { flashcardId: 'card-1', isMarked: true },
      });
    });

    it('should return mark status as false', async () => {
      mockRequest.params = { flashcardId: 'card-1' };
      (flashcardService.getFlashcardMarkStatus as jest.Mock).mockResolvedValue(false);

      await flashcardController.getFlashcardMarkStatus(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { flashcardId: 'card-1', isMarked: false },
      });
    });
  });

  describe('getListFlashcardByStudySet', () => {
    it('should return flashcards for a study set', async () => {
      mockRequest.params = { studySetId: 'set-1' };
      const mockCards = [{ id: 'card-1' }, { id: 'card-2' }];
      (flashcardService.getFlashCardByStudySetId as jest.Mock).mockResolvedValue(mockCards);

      await flashcardController.getListFlashcardByStudySet(mockRequest as Request, mockResponse as Response);

      expect(flashcardService.getFlashCardByStudySetId).toHaveBeenCalledWith('set-1', 'user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });
});
