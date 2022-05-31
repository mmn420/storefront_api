import express, { Request, Response } from 'express';
import { User, UserModel } from '../models/users';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { verifyAuthToken } from '../middleware/authenticate';

dotenv.config();

const user = new UserModel();

const generate_JWT = function (user: User): string {
  const token = jwt.sign({ user }, process.env.TOKEN_SECRET as string);
  return token;
};
const index = async (_req: Request, res: Response) => {
  const users = await user.index();
  res.status(200).json(users);
};

const show = async (req: Request, res: Response) => {
  const result = await user.show(req.body.id);
  res.status(200).json(result);
};
const create = async (req: Request, res: Response) => {
  const user_template: User = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: req.body.passowrd,
  };
  const new_user = await user.create(user_template);
  const token = generate_JWT(new_user);
  return res.status(200).json(token);
};

const authenticate = async (req: Request, res: Response) => {
  const login_user: User = {
    username: req.body.username,
    password: req.body.passowrd,
  };
  try {
    const u = (await user.authenticate(
      login_user.username,
      login_user.password
    )) as User;
    const token = generate_JWT(u);
    res.status(200).json(token).header('jwt', token);
  } catch (err) {
    res.status(401).send('Invalid authentication');
  }
};
const user_routes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
  app.post('/authenticate', authenticate);
};

export default user_routes;
