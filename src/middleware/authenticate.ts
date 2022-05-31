import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('jwt');
    if (!token) {
      return res.status(401).send('JWT not found!');
    }
    jwt.verify(token as string, process.env.TOKEN_SECRET as string);
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};
