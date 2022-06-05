import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserModel, User } from '../../models/users';
import { app } from '../../server';
dotenv.config();
const request = supertest(app);
const token_secret = String(process.env.TOKEN_SECRET);
const user_model = new UserModel();

describe('User endpoints tests', () => {
  let test_user: User;
  let token: string;
  beforeAll(async () => {
    test_user = {
      firstName: 'fName',
      lastName: 'lName',
      username: 'testuserhandler',
      password: 'testpasswordhandler',
    };
    token = jwt.sign(
      {
        firstname: test_user.firstName,
        lastname: test_user.lastName,
        username: test_user.username,
      },
      token_secret
    );
    test_user = await user_model.create(test_user);
  });

  it('should indext all users', async () => {
    const res = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.length).not.toBe(0);
  });
  it('should create a user', async () => {
    const new_user = {
      firstName: 'fName',
      lastName: 'lName',
      username: 'newuserhandler',
      password: 'newuserpassword',
    };
    const res = await request.post('/users').send(new_user);
    expect(res.body.user.username).toBe(new_user.username);
    expect(res.status).toBe(200);
  });
  it('should show user by id', async () => {
    const res = await request
      .get(`/users/${test_user.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.result.username).toBe(test_user.username);
  });
  it('should authenticate the user', async () => {
    const res = await request.post(`/authenticate`);
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
