import FlashcardMarks from '../models/FlashcardMarks'
import Flashcards from '../models/Flashcards'
import knex from '../configs/db'

interface MarkFlashcardPayload {
  userId: string
  flashcardId: string
  isMarked: boolean
}

interface MarkedFlashcardResponse {
  id: string
  flashcardId: string
  frontContent: string
  backContent: string
  studySetId: string
  studySetTitle: string
  isMarked: boolean
  markedAt: Date
  updatedAt: Date
}

class FlashcardService {
  async markFlashcard(payload: MarkFlashcardPayload): Promise<FlashcardMarks> {
    const { userId, flashcardId, isMarked } = payload

    const flashcard = await Flashcards.query().findById(flashcardId)
    if (!flashcard) {
      throw new Error('Flashcard not found')
    }

    const existingMark = await FlashcardMarks.query()
      .where('userId', userId)
      .andWhere('flashcardId', flashcardId)
      .first()

    if (existingMark) {
      const updated = await FlashcardMarks.query().patchAndFetchById(existingMark.id, {
        isMarked,
        updatedAt: new Date().toISOString(),
      })
      return updated
    }

    const newMark = await FlashcardMarks.query().insert({
      userId,
      flashcardId,
      isMarked,
      markedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return newMark
  }

  // async getMarkedFlashcards(userId: string): Promise<MarkedFlashcardResponse[]> {
  //   const markedFlashcards = await knex('flashcard_marks as fm')
  //     .select(
  //       'fm.id',
  //       'fm.flashcard_id as flashcardId',
  //       'f.front_content as frontContent',
  //       'f.back_content as backContent',
  //       'f.study_set_id as studySetId',
  //       'ss.title as studySetTitle',
  //       'fm.is_marked as isMarked',
  //       'fm.marked_at as markedAt',
  //       'fm.updated_at as updatedAt'
  //     )
  //     .join('flashcards as f', 'fm.flashcard_id', 'f.id')
  //     .join('study_sets as ss', 'f.study_set_id', 'ss.id')
  //     .where('fm.user_id', userId)
  //     .andWhere('fm.is_marked', true)
  //     .orderBy('fm.marked_at', 'desc')

  //   return markedFlashcards
  // }

  async getMarkedFlashcardsByStudySet(
    userId: string,
    studySetId: string
  ): Promise<MarkedFlashcardResponse[]> {
    const markedFlashcards = await knex('flashcard_marks as fm')
      .select(
        'fm.id',
        'fm.flashcard_id as flashcardId',
        'f.front_content as frontContent',
        'f.back_content as backContent',
        'f.study_set_id as studySetId',
        'ss.title as studySetTitle',
        'fm.is_marked as isMarked',
        'fm.marked_at as markedAt',
        'fm.updated_at as updatedAt'
      )
      .join('flashcards as f', 'fm.flashcard_id', 'f.id')
      .join('study_sets as ss', 'f.study_set_id', 'ss.id')
      .where('fm.user_id', userId)
      .andWhere('fm.is_marked', true)
      .andWhere('f.study_set_id', studySetId)
      .orderBy('fm.marked_at', 'desc')

    return markedFlashcards
  }

  async deleteFlashcardMark(userId: string, flashcardId: string): Promise<number> {
    return await FlashcardMarks.query()
      .where('userId', userId)
      .andWhere('flashcardId', flashcardId)
      .delete()
  }

  async getFlashcardMarkStatus(userId: string, flashcardId: string): Promise<boolean> {
    const mark = await FlashcardMarks.query()
      .where('userId', userId)
      .andWhere('flashcardId', flashcardId)
      .first()

    return mark ? mark.isMarked : false
  }

  async getFlashCardByStudySetId(studySetId: string, userId: string): Promise<Flashcards[]> {
    // each flashcard include isMarked field
    const flashcards = await Flashcards.query()
      .alias('flashcards')
      .leftJoin('media', 'flashcards.mediaId', 'media.id')
      .select(
        'flashcards.id',
        'flashcards.position',
        'flashcards.term',
        'flashcards.definition', 
        'flashcards.studySetId',
        'flashcards.status',
        'media.image_url as mediaImageUrl'
      )
      .where('flashcards.studySetId', studySetId)
      .orderBy('flashcards.position', 'asc')

    for (const flashcard of flashcards) {
      const isMarked = await this.getFlashcardMarkStatus(userId, flashcard.id);
      (flashcard as any).isMarked = isMarked
    }
    return flashcards
  }
}

export default new FlashcardService()
