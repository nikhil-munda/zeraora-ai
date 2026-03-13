import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!roles.includes(user.role as UserRole)) {
      res.status(403).json({
        message: `Forbidden: requires role ${roles.join(' or ')}`,
      });
      return;
    }

    next();
  };
}
