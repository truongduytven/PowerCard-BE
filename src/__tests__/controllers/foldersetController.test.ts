// Types defined in types.d.ts
import { Request, Response } from 'express';
import foldersetController from '../../controllers/foldersetController';
import foldersetService from '../../services/foldersetService';

jest.mock('../../services/foldersetService');

describe('FoldersetController', () => {
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

  describe('getAllFolderSets', () => {
    it('should return all folder sets for user', async () => {
      const mockData = [{ id: '1', title: 'Folder 1' }];
      (foldersetService.getAllFolderSets as jest.Mock).mockResolvedValue(mockData);

      await foldersetController.getAllFolderSets(mockRequest as Request, mockResponse as Response);

      expect(foldersetService.getAllFolderSets).toHaveBeenCalledWith('user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Lấy tất cả bộ thư mục thành công',
        data: mockData,
      });
    });

    it('should handle errors', async () => {
      (foldersetService.getAllFolderSets as jest.Mock).mockRejectedValue({
        status: 500,
        message: 'Server error',
      });

      await foldersetController.getAllFolderSets(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getFolderSetById', () => {
    it('should return folder set by id', async () => {
      mockRequest.params = { id: 'folder-1' };
      const mockData = { id: 'folder-1', title: 'Folder 1', studySets: [] };
      (foldersetService.getFolderSetById as jest.Mock).mockResolvedValue(mockData);

      await foldersetController.getFolderSetById(mockRequest as Request, mockResponse as Response);

      expect(foldersetService.getFolderSetById).toHaveBeenCalledWith('folder-1', 'user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should handle not found error', async () => {
      mockRequest.params = { id: 'invalid' };
      (foldersetService.getFolderSetById as jest.Mock).mockRejectedValue({
        status: 404,
        message: 'Not found',
      });

      await foldersetController.getFolderSetById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createFolderSet', () => {
    it('should create new folder set', async () => {
      mockRequest.body = { title: 'New Folder', description: 'Desc', studySets: [], icon: null };
      const mockResult = { id: 'new-folder-id' };
      (foldersetService.createFolderSet as jest.Mock).mockResolvedValue(mockResult);

      await foldersetController.createFolderSet(mockRequest as Request, mockResponse as Response);

      expect(foldersetService.createFolderSet).toHaveBeenCalledWith(
        'user-123',
        'New Folder',
        'Desc',
        null,
        []
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updateFolderSet', () => {
    it('should update folder set', async () => {
      mockRequest.params = { id: 'folder-1' };
      mockRequest.body = { title: 'Updated', description: 'Updated desc', studySets: [] };
      (foldersetService.updateFolderSet as jest.Mock).mockResolvedValue(undefined);

      await foldersetController.updateFolderSet(mockRequest as Request, mockResponse as Response);

      expect(foldersetService.updateFolderSet).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteFolderSet', () => {
    it('should delete folder set', async () => {
      mockRequest.params = { id: 'folder-1' };
      (foldersetService.deleteFolderSet as jest.Mock).mockResolvedValue(undefined);

      await foldersetController.deleteFolderSet(mockRequest as Request, mockResponse as Response);

      expect(foldersetService.deleteFolderSet).toHaveBeenCalledWith('folder-1', 'user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });
});
