import express from 'express'
const router = express.Router()

import AuthRoute from './auth'
import FolderSetRoute from './folderset'
import StudySetRoute from './studysets'
import MediaRoute from './media'
import { protectedRoute } from '../middlewares/authMiddleware'

router.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: 'API is working' })
})
router.use('/auth', AuthRoute)
router.use('/folderset', protectedRoute, FolderSetRoute)
router.use('/studyset', protectedRoute, StudySetRoute)
router.use('/media', protectedRoute, MediaRoute)

export default router