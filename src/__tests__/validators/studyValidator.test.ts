import {
  startStudyValidator,
  getCardsValidator,
  startLearningValidator,
  submitAnswerValidator,
  updateDifficultyValidator,
} from '../../validators/studyValidator';
import { validationResult } from 'express-validator';

describe('Study Validators', () => {
  describe('startStudyValidator', () => {
    it('should pass with valid studySetId', async () => {
      const req: any = {
        body: {
          studySetId: '123e4567-e89b-12d3-a456-426614174000',
        },
      };

      await Promise.all(startStudyValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid UUID', async () => {
      const req: any = {
        body: {
          studySetId: 'invalid-uuid',
        },
      };

      await Promise.all(startStudyValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject empty studySetId', async () => {
      const req: any = {
        body: {},
      };

      await Promise.all(startStudyValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });
  });

  describe('getCardsValidator', () => {
    it('should pass with valid direction', async () => {
      const req: any = {
        query: {
          direction: 'next',
          limit: '20',
        },
      };

      await Promise.all(getCardsValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should accept prev direction', async () => {
      const req: any = {
        query: {
          direction: 'prev',
        },
      };

      await Promise.all(getCardsValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid direction', async () => {
      const req: any = {
        query: {
          direction: 'invalid',
        },
      };

      await Promise.all(getCardsValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject limit > 100', async () => {
      const req: any = {
        query: {
          limit: '101',
        },
      };

      await Promise.all(getCardsValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should allow optional parameters', async () => {
      const req: any = {
        query: {},
      };

      await Promise.all(getCardsValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });
  });

  describe('startLearningValidator', () => {
    it('should pass with valid UUID param', async () => {
      const req: any = {
        params: {
          studySetId: '123e4567-e89b-12d3-a456-426614174000',
        },
      };

      await Promise.all(startLearningValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid UUID', async () => {
      const req: any = {
        params: {
          studySetId: 'not-valid',
        },
      };

      await Promise.all(startLearningValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });
  });

  describe('submitAnswerValidator', () => {
    it('should pass with valid IDs', async () => {
      const req: any = {
        body: {
          flashcardId: '123e4567-e89b-12d3-a456-426614174000',
          difficultyId: '123e4567-e89b-12d3-a456-426614174001',
          userLearnId: '123e4567-e89b-12d3-a456-426614174002',
        },
      };

      await Promise.all(submitAnswerValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid flashcardId', async () => {
      const req: any = {
        body: {
          flashcardId: 'invalid',
          difficultyId: '123e4567-e89b-12d3-a456-426614174001',
        },
      };

      await Promise.all(submitAnswerValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject empty fields', async () => {
      const req: any = {
        body: {},
      };

      await Promise.all(submitAnswerValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });
  });

  describe('updateDifficultyValidator', () => {
    it('should pass with valid data', async () => {
      const req: any = {
        body: {
          difficulties: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              minutes: 5,
            },
            {
              id: '123e4567-e89b-12d3-a456-426614174001',
              minutes: 10,
            },
          ],
        },
      };

      await Promise.all(updateDifficultyValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid UUIDs', async () => {
      const req: any = {
        body: {
          learnFlashcardId: 'invalid',
          difficultyId: 'invalid',
        },
      };

      await Promise.all(updateDifficultyValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });
  });
});
