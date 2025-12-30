import {
  configureDifficultyValidator,
  getDifficultyValidator,
} from '../../validators/difficulty';
import { validationResult } from 'express-validator';

describe('Difficulty Validators', () => {
  describe('configureDifficultyValidator', () => {
    it('should pass with valid data', async () => {
      const req: any = {
        body: {
          userLearnId: '123e4567-e89b-12d3-a456-426614174000',
          difficulties: [
            { name: 'Easy', minutes: 5 },
            { name: 'Medium', minutes: 10 },
            { name: 'Hard', minutes: 15 },
          ],
        },
      };

      await Promise.all(configureDifficultyValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid userLearnId UUID', async () => {
      const req: any = {
        body: {
          userLearnId: 'invalid-uuid',
          difficulties: [{ name: 'Easy', minutes: 5 }],
        },
      };

      await Promise.all(configureDifficultyValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()).toContainEqual(
        expect.objectContaining({
          path: 'userLearnId',
          msg: 'userLearnId phải là UUID hợp lệ',
        })
      );
    });

    it('should reject non-array difficulties', async () => {
      const req: any = {
        body: {
          userLearnId: '123e4567-e89b-12d3-a456-426614174000',
          difficulties: 'not-an-array',
        },
      };

      await Promise.all(configureDifficultyValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject negative minutes', async () => {
      const req: any = {
        body: {
          userLearnId: '123e4567-e89b-12d3-a456-426614174000',
          difficulties: [{ name: 'Easy', minutes: -5 }],
        },
      };

      await Promise.all(configureDifficultyValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject zero minutes', async () => {
      const req: any = {
        body: {
          userLearnId: '123e4567-e89b-12d3-a456-426614174000',
          difficulties: [{ name: 'Easy', minutes: 0 }],
        },
      };

      await Promise.all(configureDifficultyValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject empty difficulty name', async () => {
      const req: any = {
        body: {
          userLearnId: '123e4567-e89b-12d3-a456-426614174000',
          difficulties: [{ name: '', minutes: 5 }],
        },
      };

      await Promise.all(configureDifficultyValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });
  });

  describe('getDifficultyValidator', () => {
    it('should pass with valid userLearnId', async () => {
      const req: any = {
        query: {
          userLearnId: '123e4567-e89b-12d3-a456-426614174000',
        },
      };

      await Promise.all(getDifficultyValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid UUID', async () => {
      const req: any = {
        query: {
          userLearnId: 'not-a-uuid',
        },
      };

      await Promise.all(getDifficultyValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject empty userLearnId', async () => {
      const req: any = {
        query: {},
      };

      await Promise.all(getDifficultyValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });
  });
});
