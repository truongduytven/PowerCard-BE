import { Request, Response } from 'express';
import cloudinary from '../configs/cloudinary';
import Media from '../models/Media';

class MediaController {
  async uploadMedia(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      if (!userId) {
        return res.status(401).json({ message: 'Không có quyền truy cập' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'Chưa có file được tải lên' });
      }

      const uploadImage = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `PowerCard/media`,
            transformation: [
              { width: 400, height: 400, crop: 'limit' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file?.buffer);
      })

      const result = await Media.query().insert({
        imageUrl: uploadImage.secure_url,
        imageId: uploadImage.public_id,
        status: 'active'
      });

      const { id, ...data } = result;
      res.status(201).json({ message: 'Tải lên media thành công', data });
    } catch (error) {
      console.error('Error uploading media:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ' });
    }
  }
}

export default new MediaController();