import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../configs/cloudinary'

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'PowerCard',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  })
})

const uploadCloud = multer({ storage });

export default uploadCloud
