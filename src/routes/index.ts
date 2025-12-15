import express from 'express'
const router = express.Router()

import AuthRoute from './auth'
import FolderSetRoute from './folderset'
import StudySetRoute from './studysets'
import MediaRoute from './media'
import TopicRoute from './topic'
import StudyRoute from './study'
import DifficultyRoute from './difficulty'
import { protectedRoute } from '../middlewares/authMiddleware'

router.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: 'API is working' })
})
router.use('/auth', AuthRoute)
router.use('/folderset', protectedRoute, FolderSetRoute)
router.use('/studyset', protectedRoute, StudySetRoute)
router.use('/study', protectedRoute, StudyRoute)
router.use('/difficulty', protectedRoute, DifficultyRoute)
router.use('/media', protectedRoute, MediaRoute)
router.use('/topic', protectedRoute, TopicRoute)

export default router