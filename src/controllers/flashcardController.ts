import { Request, Response } from 'express'
import flashcardService from '../services/flashcardService'

class FlashcardController {
  async markFlashcard(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        })
      }

      const { flashcardId, isMarked } = req.body

      if (!flashcardId || typeof isMarked !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'flashcardId and isMarked (boolean) are required',
        })
      }

      const result = await flashcardService.markFlashcard({
        userId,
        flashcardId,
        isMarked,
      })

      return res.status(200).json({
        success: true,
        message: isMarked ? 'Flashcard marked successfully' : 'Flashcard unmarked successfully',
        data: result,
      })
    } catch (error: any) {
      console.error('Error marking flashcard:', error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error',
      })
    }
  }


  async getMarkedFlashcards(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id
      const studySetId = req.params.studySetId as string | undefined

      if (!studySetId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid studySetId',
        })
      }

      const markedFlashcards = await flashcardService.getMarkedFlashcardsByStudySet(userId, studySetId)

      return res.status(200).json({
        success: true,
        message: 'Marked flashcards retrieved successfully',
        data: markedFlashcards,
        total: markedFlashcards.length,
      })
    } catch (error: any) {
      console.error('Error getting marked flashcards:', error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error',
      })
    }
  }

  async deleteFlashcardMark(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        })
      }

      const { flashcardId } = req.params

      if (!flashcardId) {
        return res.status(400).json({
          success: false,
          message: 'flashcardId is required',
        })
      }

      await flashcardService.deleteFlashcardMark(userId, flashcardId)

      return res.status(200).json({
        success: true,
        message: 'Flashcard mark deleted successfully',
      })
    } catch (error: any) {
      console.error('Error deleting flashcard mark:', error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error',
      })
    }
  }

  async getFlashcardMarkStatus(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        })
      }

      const { flashcardId } = req.params

      if (!flashcardId) {
        return res.status(400).json({
          success: false,
          message: 'flashcardId is required',
        })
      }

      const isMarked = await flashcardService.getFlashcardMarkStatus(userId, flashcardId)

      return res.status(200).json({
        success: true,
        data: {
          flashcardId,
          isMarked,
        },
      })
    } catch (error: any) {
      console.error('Error getting flashcard mark status:', error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error',
      })
    }
  }
}

export default new FlashcardController()
