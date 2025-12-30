import {
  createTopicValidator,
  updateTopicValidator,
  topicIdParamValidator,
} from '../../validators/topicValidator';
import { validationResult } from 'express-validator';

describe('Topic Validators', () => {
  describe('createTopicValidator', () => {
    it('should pass with valid data', async () => {
      const req: any = {
        body: {
          name: 'Mathematics',
          description: 'Math related topics',
        },
      };

      await Promise.all(createTopicValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should pass without optional description', async () => {
      const req: any = {
        body: {
          name: 'Science',
        },
      };

      await Promise.all(createTopicValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject empty name', async () => {
      const req: any = {
        body: {
          name: '',
        },
      };

      await Promise.all(createTopicValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject name > 100 characters', async () => {
      const req: any = {
        body: {
          name: 'a'.repeat(101),
        },
      };

      await Promise.all(createTopicValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject description > 500 characters', async () => {
      const req: any = {
        body: {
          name: 'Topic',
          description: 'a'.repeat(501),
        },
      };

      await Promise.all(createTopicValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });
  });

  describe('updateTopicValidator', () => {
    it('should pass with valid data', async () => {
      const req: any = {
        params: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
        body: {
          name: 'Updated Topic',
          description: 'Updated description',
        },
      };

      await Promise.all(updateTopicValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should pass with only name', async () => {
      const req: any = {
        params: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
        body: {
          name: 'Updated Topic',
        },
      };

      await Promise.all(updateTopicValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid UUID param', async () => {
      const req: any = {
        params: {
          id: 'invalid-uuid',
        },
        body: {
          name: 'Topic',
        },
      };

      await Promise.all(updateTopicValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should allow empty body with valid params', async () => {
      const req: any = {
        params: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
        body: {},
      };

      await Promise.all(updateTopicValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });
  });

  describe('topicIdParamValidator', () => {
    it('should pass with valid UUID', async () => {
      const req: any = {
        params: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
      };

      await Promise.all(topicIdParamValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid UUID', async () => {
      const req: any = {
        params: {
          id: 'not-a-uuid',
        },
      };

      await Promise.all(topicIdParamValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject empty param', async () => {
      const req: any = {
        params: {},
      };

      await Promise.all(topicIdParamValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });
  });
});
