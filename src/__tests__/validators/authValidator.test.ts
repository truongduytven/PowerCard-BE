import { registerValidator, loginValidator } from '../../validators/authValidator';
import { validationResult } from 'express-validator';

describe('Auth Validators', () => {
  describe('registerValidator', () => {
    it('should pass with valid data', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        },
      };

      await Promise.all(registerValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid email', async () => {
      const req: any = {
        body: {
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User',
        },
      };

      await Promise.all(registerValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()).toContainEqual(
        expect.objectContaining({
          path: 'email',
          msg: 'Email không hợp lệ',
        })
      );
    });

    it('should reject password less than 6 characters', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          password: '12345',
          name: 'Test User',
        },
      };

      await Promise.all(registerValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()).toContainEqual(
        expect.objectContaining({
          path: 'password',
          msg: 'Password phải có ít nhất 6 ký tự',
        })
      );
    });

    it('should reject name less than 2 characters', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          name: 'A',
        },
      };

      await Promise.all(registerValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject empty fields', async () => {
      const req: any = {
        body: {},
      };

      await Promise.all(registerValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('loginValidator', () => {
    it('should pass with valid credentials', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };

      await Promise.all(loginValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid email', async () => {
      const req: any = {
        body: {
          email: 'not-an-email',
          password: 'password123',
        },
      };

      await Promise.all(loginValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject empty password', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          password: '',
        },
      };

      await Promise.all(loginValidator.map((v) => v.run(req)));
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });
  });
});
