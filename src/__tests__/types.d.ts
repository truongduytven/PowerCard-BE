// Extend Express Request type globally
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email?: string;
      name?: string;
      [key: string]: any;
    };
  }
}
