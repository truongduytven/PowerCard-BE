import cloudinary from '../configs/cloudinary';
import Media from '../models/Media';
import { ApiError } from '../utils/ApiError';

class MediaService {
  async uploadMedia(userId: string, file: Express.Multer.File) {
    if (!userId) {
      throw new ApiError(401, 'Không có quyền truy cập');
    }

    if (!file) {
      throw new ApiError(400, 'Chưa có file được tải lên');
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
          if (error) {
            reject(
              error instanceof Error
                ? error
                : new Error(error?.message || 'Cloudinary upload failed')
            );
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(file.buffer);
    });

    const result = await Media.query().insert({
      imageUrl: uploadImage.secure_url,
      imageId: uploadImage.public_id,
      status: 'active'
    });

    return result;
  }

  async getMediaList(search?: string) {
    let query = Media.query()
      .where('status', 'active')
      .andWhere('isPublic', true);

    if (search) {
      query = query.andWhere('name', 'like', `%${search}%`);
    }

    const result = await query;
    return result;
  }
}

export default new MediaService();
