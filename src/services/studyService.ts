import UserLearns from "../models/UserLearns";
import Flashcards from "../models/Flashcards";
import LearnFlashcards from "../models/LearnFlashcards";
import Difficulties from "../models/Difficulties";

interface IFlashcardResponse {
  id: string;
  isLearned: boolean;
  position: number;
  term: string;
  definition: string;
  imageUrl: string | null;
}

class StudyService {
  async getStudyData(userId: string, userLearnId: string, page: number, pageSize: number) {
    const userStudy = await UserLearns.query().where('userId', userId).andWhere('id', userLearnId).first();
    if (!userStudy) {
      throw new Error('User has not started studying this set');
    }

    const totalFlashcards = await LearnFlashcards.query()
      .where('userLearnId', userStudy.id)
      .resultSize();

    const flashcards = await LearnFlashcards.query()
      .where('userLearnId', userStudy.id)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .withGraphFetched('flashcard.media')
      .modifyGraph('flashcard', (builder) => {
        builder.select('id', 'mediaId', 'position', 'term', 'definition');
      })
      .modifyGraph('flashcard.media', (builder) => {
        builder.select('imageUrl');
      });

    const formattedFlashcards: IFlashcardResponse[] = flashcards.map((learnFlashcard: any) => ({
      id: learnFlashcard.id,
      isLearned: learnFlashcard.isLearned,
      position: learnFlashcard.flashcard.position,
      term: learnFlashcard.flashcard.term,
      definition: learnFlashcard.flashcard.definition,
      imageUrl: learnFlashcard.flashcard.media ? learnFlashcard.flashcard.media.imageUrl : null,
    }));

    const totalPages = Math.ceil(totalFlashcards / pageSize);
    if (page > totalPages && totalPages > 0) {
      throw new Error('Page number exceeds total pages');
    }  
    return {
      totalItems: totalFlashcards,
      totalPages,
      page,
      pageSize,
      data: formattedFlashcards,
    };
  }

  async startStudy(userId: string, studySetId: string) {
    const userStudy = await UserLearns.query().where('userId', userId).andWhere('studySetId', studySetId).first();
    
    if (!userStudy) {
      const userStudyData = await UserLearns.query().insert({
        userId,
        studySetId,
        processing: 0,
        status: 'in_progress',
      });
      const listFlashcards = await Flashcards.query().where('studySetId', studySetId).orderBy('position', 'asc');
      await Promise.all(listFlashcards.map(async (flashcard) => {
        await LearnFlashcards.query().insert({
          userLearnId: userStudyData.id,
          flashcardId: flashcard.id,
          isLearned: false,
          difficultyId: null,
          nextReviewAt: null,
          lastReviewedAt: null,
        });
      }));
      await Promise.all([
        Difficulties.query().insert({
          userLearnId: userStudyData.id,
          name: 'Easy',
          minutes: 10,
        }),
        Difficulties.query().insert({
          userLearnId: userStudyData.id,
          name: 'Medium',
          minutes: 20
        }),
        Difficulties.query().insert({
          userLearnId: userStudyData.id,
          name: 'Hard',
          minutes: 30
        }),
        Difficulties.query().insert({
          userLearnId: userStudyData.id,
          name: 'Very Hard',
          minutes: 60,
        }),
      ])
      return { userLearnId: userStudyData.id, type: 'new' };
    }
    return { userLearnId: userStudy.id, type: 'existing' };
  }
}

export default new StudyService();