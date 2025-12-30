import {
  overviewQueryValidator,
  heatmapQueryValidator,
} from '../../validators/overviewValidator';
import { validationResult } from 'express-validator';

describe('Overview Validators', () => {
  describe('overviewQueryValidator', () => {
    it('should pass with valid week period', async () => {
      const req: any = {
        query: {
          period: 'week',
        },
      };

      await Promise.all(overviewQueryValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should pass with valid month period', async () => {
      const req: any = {
        query: {
          period: 'month',
        },
      };

      await Promise.all(overviewQueryValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should pass with valid year period', async () => {
      const req: any = {
        query: {
          period: 'year',
        },
      };

      await Promise.all(overviewQueryValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should pass with empty query (optional)', async () => {
      const req: any = {
        query: {},
      };

      await Promise.all(overviewQueryValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid period', async () => {
      const req: any = {
        query: {
          period: 'invalid',
        },
      };

      await Promise.all(overviewQueryValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()).toContainEqual(
        expect.objectContaining({
          path: 'period',
          msg: 'period phải là một trong các giá trị: week, month, year',
        })
      );
    });
  });

  describe('heatmapQueryValidator', () => {
    it('should pass with valid week period', async () => {
      const req: any = {
        query: {
          period: 'week',
        },
      };

      await Promise.all(heatmapQueryValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should pass with valid month period', async () => {
      const req: any = {
        query: {
          period: 'month',
        },
      };

      await Promise.all(heatmapQueryValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should pass with valid year period', async () => {
      const req: any = {
        query: {
          period: 'year',
        },
      };

      await Promise.all(heatmapQueryValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should pass without period (optional)', async () => {
      const req: any = {
        query: {},
      };

      await Promise.all(heatmapQueryValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid period value', async () => {
      const req: any = {
        query: {
          period: 'day',
        },
      };

      await Promise.all(heatmapQueryValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });
  });
});
