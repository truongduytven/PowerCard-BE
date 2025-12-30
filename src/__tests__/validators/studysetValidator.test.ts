import { getPublicStudySetsQueryValidator } from '../../validators/studysetValidator';
import { validationResult } from 'express-validator';

describe('StudySet Validators', () => {
  describe('getPublicStudySetsQueryValidator', () => {
    it('should accept valid query parameters', async () => {
      const req: any = {
        query: {
          page: '1',
          limit: '20',
          search: 'test',
        }
      };

      await Promise.all(getPublicStudySetsQueryValidator.map(v => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid page number', async () => {
      const req: any = {
        query: {
          page: '0',
        }
      };

      await Promise.all(getPublicStudySetsQueryValidator.map(v => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()).toContainEqual(
        expect.objectContaining({ 
          path: 'page',
          msg: 'page phải là số nguyên dương'
        })
      );
    });

    it('should reject limit > 100', async () => {
      const req: any = {
        query: {
          limit: '101',
        }
      };

      await Promise.all(getPublicStudySetsQueryValidator.map(v => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should allow optional parameters', async () => {
      const req: any = {
        query: {}
      };

      await Promise.all(getPublicStudySetsQueryValidator.map(v => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });
  });
});
