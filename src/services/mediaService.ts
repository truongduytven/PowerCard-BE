import cloudinary from '../configs/cloudinary';
import Media from '../models/Media';

class MediaService {
  async uploadMedia(userId: string, file: Express.Multer.File) {
    if (!userId) {
      throw { status: 401, message: 'Không có quyền truy cập' };
    }

    if (!file) {
      throw { status: 400, message: 'Chưa có file được tải lên' };
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
