import {
  createFolderSetValidator,
  updateFolderSetValidator,
  folderSetIdParamValidator,
} from '../../validators/foldersetValidator';
import { validationResult } from 'express-validator';

describe('FolderSet Validators', () => {
  describe('createFolderSetValidator', () => {
    it('should pass with valid data', async () => {
      const req: any = {
        body: {
          title: 'Test Folder',
          description: 'Test Description',
          icon: '📁',
          studySets: ['123e4567-e89b-12d3-a456-426614174000'],
        },
      };

      await Promise.all(createFolderSetValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject empty title', async () => {
      const req: any = {
        body: {
          title: '',
          icon: '📁',
          studySets: ['123e4567-e89b-12d3-a456-426614174000'],
        },
      };

      await Promise.all(createFolderSetValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject title > 255 characters', async () => {
      const req: any = {
        body: {
          title: 'a'.repeat(256),
          icon: '📁',
          studySets: ['123e4567-e89b-12d3-a456-426614174000'],
        },
      };

      await Promise.all(createFolderSetValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject invalid UUID in studySets array', async () => {
      const req: any = {
        body: {
          title: 'Test Folder',
          icon: '📁',
          studySets: ['not-a-uuid'],
        },
      };

      await Promise.all(createFolderSetValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject non-array studySets', async () => {
      const req: any = {
        body: {
          title: 'Test Folder',
          icon: '📁',
          studySets: 'not-an-array',
        },
      };

      await Promise.all(createFolderSetValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should accept optional description', async () => {
      const req: any = {
        body: {
          title: 'Test Folder',
          icon: '📁',
          studySets: ['123e4567-e89b-12d3-a456-426614174000'],
        },
      };

      await Promise.all(createFolderSetValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });
  });

  describe('updateFolderSetValidator', () => {
    it('should pass with valid data', async () => {
      const req: any = {
        params: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
        body: {
          title: 'Updated Folder',
          description: 'Updated Description',
          icon: '📂',
          studySets: ['123e4567-e89b-12d3-a456-426614174001'],
        },
      };

      await Promise.all(updateFolderSetValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid UUID param', async () => {
      const req: any = {
        params: {
          id: 'invalid-uuid',
        },
        body: {
          title: 'Updated Folder',
        },
      };

      await Promise.all(updateFolderSetValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });
  });

  describe('folderSetIdParamValidator', () => {
    it('should pass with valid UUID', async () => {
      const req: any = {
        params: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
      };

      await Promise.all(folderSetIdParamValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid UUID', async () => {
      const req: any = {
        params: {
          id: 'not-valid',
        },
      };

      await Promise.all(folderSetIdParamValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });
  });
});