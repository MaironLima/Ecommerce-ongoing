declare global {
  namespace Express {
    interface User {
      role: string;
    }
    interface Request {
      user?: User;
    }
  }
}

export {};
