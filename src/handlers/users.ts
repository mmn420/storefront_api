import express from 'express';
import { Request, Response } from 'express';
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
  try {
    const users = await user.index();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ err });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const result = await user.show(parseInt(req.params.id));
    if (!result) {
      res.status(404).send('User with this id not found');
    }
    res.status(200).json({ result });
  } catch (err) {
    res.status(400).json({ err });
  }
};
const create = async (req: Request, res: Response) => {
  try {
    const user_template: User = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.passowrd,
    };
    const new_user = await user.create(user_template);
    const token = generate_JWT(new_user);
    return res.status(200).json({ token: token, user: new_user });
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    res.status(400).json({ err: err.message as string });
  }
};
const delete_user = async (req: Request, res: Response) => {
  try {
    const deleted_user = await user.delete(parseInt(req.params.id));
    if (!deleted_user) {
      res.status(404).send('Cannot find user with this id');
    }
    res.status(200).json({ deleted_user });
  } catch (err) {
    res.status(400).json({ err });
  }
};

const authenticate = async (req: Request, res: Response) => {
  const login_user: User = {
    username: req.body.username,
    password: req.body.password,
  };
  try {
    const u = (await user.authenticate(
      login_user.username,
      login_user.password
    )) as User;
    const token = generate_JWT(u);
    res.status(200).json({ token: token, user: login_user.username });
  } catch (err) {
    res.status(401).send('Invalid authentication');
  }
};
const user_routes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.delete('/users/:id', verifyAuthToken, delete_user);
  app.post('/users', create);
  app.post('/authenticate', authenticate);
};

export default user_routes;
