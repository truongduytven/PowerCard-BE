import { Request, Response } from 'express';
import mediaService from '../services/mediaService';

class MediaController {
  async uploadMedia(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      if (!req.file) {
        return res.status(400).json({ message: 'Chưa có file được tải lên' });
      }

      const result = await mediaService.uploadMedia(userId, req.file);
      res.status(201).json({ message: 'Tải lên media thành công', data: result });
    } catch (error: any) {
      console.error('Error uploading media:', error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ' });
    }
  }

  async getMediaList(req: Request, res: Response) {
    try {
      const search = req.query.search as string | undefined;
      const result = await mediaService.getMediaList(search);
      res.status(200).json({ message: 'Lấy danh sách media thành công', data: result });
    } catch (error: any) {
      console.error('Error fetching media list:', error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ' });
    }
  }
}

export default new MediaController();