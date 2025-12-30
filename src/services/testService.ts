import Flashcards from "../models/Flashcards";
import StudySets from "../models/StudySets";
import { ApiError } from "../utils/ApiError";

interface TestQuestion {
  id: string;
  term: string;
  answers: string[];
  correctAnswer: string;
}

interface TestResponse {
  studySetId: string;
  questions: TestQuestion[];
}

class TestService {
  /**
   * Generate test questions for a study set
   * No database writes - purely runtime logic
   * 
   * @param studySetId - The study set to generate test from
   * @param limit - Number of questions (default 20)
   */
  async generateTest(studySetId: string, limit: number = 20): Promise<TestResponse> {
    // Check if study set exists
    const studySet = await StudySets.query()
      .findById(studySetId)
      .where('status', 'active');

    if (!studySet) {
      throw new ApiError(404, "Bộ học tập không tồn tại");
    }

    // Get all flashcards from the study set
    const flashcards = await Flashcards.query()
      .where('study_set_id', studySetId)
      .orderBy('position', 'asc');

    if (flashcards.length === 0) {
      throw new ApiError(400, "Bộ học tập không có flashcard nào");
    }

    if (flashcards.length < 4) {
      throw new ApiError(400, "Bộ học tập cần ít nhất 4 flashcards để tạo bài test");
    }

    // Limit questions to available flashcards
    const questionCount = Math.min(limit, flashcards.length);
    
    // Shuffle and select flashcards for questions
    const selectedFlashcards = this.shuffleArray([...flashcards]).slice(0, questionCount);
    
    // Generate questions
    const questions: TestQuestion[] = selectedFlashcards.map(flashcard => {
      return this.generateQuestion(flashcard, flashcards);
    });

    return {
      studySetId,
      questions
    };
  }

  /**
   * Generate a single question with 4 answers (1 correct + 3 wrong)
   */
  private generateQuestion(
    correctFlashcard: any, 
    allFlashcards: any[]
  ): TestQuestion {
    const correctAnswer = correctFlashcard.definition;
    
    // Get other flashcards (excluding the correct one)
    const otherFlashcards = allFlashcards.filter(
      fc => fc.id !== correctFlashcard.id
    );

    // Shuffle and get 3 wrong answers
    const wrongAnswers = this.shuffleArray(otherFlashcards)
      .slice(0, 3)
      .map(fc => fc.definition);

    // Combine and shuffle all answers
    const allAnswers = [correctAnswer, ...wrongAnswers];
    const shuffledAnswers = this.shuffleArray(allAnswers);

    return {
      id: correctFlashcard.id,
      term: correctFlashcard.term,
      answers: shuffledAnswers,
      correctAnswer: correctAnswer
    };
  }

  /**
   * Fisher-Yates shuffle algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export default new TestService();
