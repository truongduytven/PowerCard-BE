import UserLearns from "../models/UserLearns";
import Flashcards from "../models/Flashcards";
import LearnFlashcards from "../models/LearnFlashcards";
import Difficulties from "../models/Difficulties";
import SessionStore from "../utils/SessionStore";
import { ApiError } from "../utils/ApiError";

interface IFlashcardResponse {
  id: string;
  isLearned: boolean;
  position: number;
  term: string;
  definition: string;
  imageUrl: string | null;
}

class StudyService {
  async startStudySession(userId: string, studySetId: string) {
    let userStudy = await UserLearns.query()
      .where('userId', userId)
      .andWhere('studySetId', studySetId)
      .first();
    
    if (!userStudy) {
      userStudy = await UserLearns.query().insert({
        userId,
        studySetId,
        processing: 0,
        status: 'in_progress',
      });

      const listFlashcards = await Flashcards.query()
        .where('studySetId', studySetId)
        .orderBy('position', 'asc');

      await Promise.all(listFlashcards.map(async (flashcard) => {
        await LearnFlashcards.query().insert({
          userLearnId: userStudy!.id,
          flashcardId: flashcard.id,
          isLearned: false,
          difficultyId: null,
          nextReviewAt: null,
          lastReviewedAt: null,
        });
      }));

      await Promise.all([
        Difficulties.query().insert({
          userLearnId: userStudy.id,
          name: 'Easy',
          minutes: 10,
        }),
        Difficulties.query().insert({
          userLearnId: userStudy.id,
          name: 'Medium',
          minutes: 20
        }),
        Difficulties.query().insert({
          userLearnId: userStudy.id,
          name: 'Hard',
          minutes: 30
        }),
        Difficulties.query().insert({
          userLearnId: userStudy.id,
          name: 'Very Hard',
          minutes: 60,
        }),
      ]);
    } else if (userStudy.status === 'complete') {
      await UserLearns.query()
        .where('id', userStudy.id)
        .patch({
          processing: 0,
          status: 'in_progress',
        });
      userStudy.processing = 0;
      userStudy.status = 'in_progress';
    }

    const flashcards = await Flashcards.query()
      .where('studySetId', studySetId)
      .orderBy('position', 'asc')
      .select('id');

    if (!flashcards.length) {
      throw new Error('Study set has no flashcards');
    }

    const flashcardIds = flashcards.map(f => f.id);
    const sessionId = SessionStore.createSession(userId, studySetId, flashcardIds);

    return {
      sessionId,
      totalCards: flashcardIds.length,
      currentIndex: userStudy.processing,
      userLearnId: userStudy.id,
    };
  }

  async getStudyCards(sessionId: string, direction: 'next' | 'prev', limit: number = 10) {
    const session = SessionStore.getSession(sessionId);
    
    if (!session) {
      throw new ApiError(401, 'SESSION_EXPIRED');
    }

    const userStudy = await UserLearns.query()
      .where('userId', session.userId)
      .andWhere('studySetId', session.studySetId)
      .first();

    if (!userStudy) {
      throw new Error('User study not found');
    }

    let newIndex;
    
    if (direction === 'next') {
      newIndex = Math.min(session.currentIndex + limit, session.flashcardOrder.length);
    } else {
      newIndex = Math.max(session.currentIndex - limit, 0);
    }

    const startIdx = Math.min(session.currentIndex, newIndex);
    const endIdx = Math.max(session.currentIndex, newIndex);
    const flashcardIds = session.flashcardOrder.slice(startIdx, endIdx);

    const now = new Date();
    const learnFlashcards = await LearnFlashcards.query()
      .where('userLearnId', userStudy.id)
      .whereIn('flashcardId', flashcardIds)
      .withGraphFetched('flashcard.media')
      .modifyGraph('flashcard', (builder) => {
        builder.select('id', 'mediaId', 'position', 'term', 'definition');
      });

    const availableLearnFlashcards = learnFlashcards.filter(lf => 
      !lf.nextReviewAt || new Date(lf.nextReviewAt) <= now
    );

    const orderedFlashcards = flashcardIds
      .map(id => availableLearnFlashcards.find(lf => (lf as any).flashcard.id === id))
      .filter(Boolean);

    const formattedFlashcards: IFlashcardResponse[] = orderedFlashcards.map((lf: any) => ({
      id: lf.flashcard.id,
      isLearned: lf.isLearned,
      position: lf.flashcard.position,
      term: lf.flashcard.term,
      definition: lf.flashcard.definition,
      imageUrl: lf.flashcard.media ? lf.flashcard.media.imageUrl : null,
    }));

    SessionStore.updateIndex(sessionId, newIndex);

    return {
      data: formattedFlashcards,
      currentIndex: newIndex,
      totalCards: session.flashcardOrder.length,
    };
  }
}

export default new StudyService();