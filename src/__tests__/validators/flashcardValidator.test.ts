import {
  markFlashcardValidator,
  flashcardIdParamValidator,
  markedStudySetValidator,
} from '../../validators/flashcardValidator';
import { validationResult } from 'express-validator';

describe('Flashcard Validators', () => {
  describe('markFlashcardValidator', () => {
    it('should pass with valid data', async () => {
      const req: any = {
        body: {
          flashcardId: '123e4567-e89b-12d3-a456-426614174000',
          isMarked: true,
        },
      };

      await Promise.all(markFlashcardValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid UUID', async () => {
      const req: any = {
        body: {
          flashcardId: 'invalid-uuid',
          isMarked: true,
        },
      };

      await Promise.all(markFlashcardValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()).toContainEqual(
        expect.objectContaining({
          path: 'flashcardId',
          msg: 'flashcardId phải là UUID hợp lệ',
        })
      );
    });

    it('should reject non-boolean isMarked', async () => {
      const req: any = {
        body: {
          flashcardId: '123e4567-e89b-12d3-a456-426614174000',
          isMarked: 'yes',
        },
      };

      await Promise.all(markFlashcardValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject empty fields', async () => {
      const req: any = {
        body: {},
      };

      await Promise.all(markFlashcardValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });
  });

  describe('flashcardIdParamValidator', () => {
    it('should pass with valid UUID param', async () => {
      const req: any = {
        params: {
          flashcardId: '123e4567-e89b-12d3-a456-426614174000',
        },
      };

      await Promise.all(flashcardIdParamValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid UUID param', async () => {
      const req: any = {
        params: {
          flashcardId: 'not-a-uuid',
        },
      };

      await Promise.all(flashcardIdParamValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });
  });

  describe('markedStudySetValidator', () => {
    it('should pass with valid studySetId param', async () => {
      const req: any = {
        params: {
          studySetId: '123e4567-e89b-12d3-a456-426614174000',
        },
      };

      await Promise.all(markedStudySetValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid UUID', async () => {
      const req: any = {
        params: {
          studySetId: 'invalid',
        },
      };

      await Promise.all(markedStudySetValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });
  });
});
