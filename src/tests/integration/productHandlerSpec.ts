import { Product, ProductModel } from '../../models/products';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserModel, User } from '../../models/users';
import { app } from '../../server';
dotenv.config();
const request = supertest(app);
const token_secret = String(process.env.TOKEN_SECRET);
const user_model = new UserModel();
const product_model = new ProductModel();

describe('Product endpoints tests', () => {
  let test_user: User;
  let token: string;
  let test_product2: Product;
  const test_product = {
    name: 'test_product',
    category: 'test',
    price: 20,
  };
  beforeAll(async () => {
    test_user = {
      firstName: 'fName',
      lastName: 'lName',
      username: 'producthandlertest',
      password: 'testpasswordhandler',
    };
    test_product2 = {
      name: 'testporudct2',
      price: 25,
      category: 'test2',
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
    test_product2 = (await product_model.create(test_product2)) as Product;
  });
  it('Should create a new product', async () => {
    const res = await request
      .post('/products')
      .send(test_product)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
  it('Should index all products', async () => {
    const res = await request.get('/products');
    expect(res.status).toBe(200);
    expect(res.body.length).not.toBe(0);
  });
  it('Should show product by id', async () => {
    const res = await request.get(`/products/${test_product2.id}`);
    expect(res.status).toBe(200);
  });
  it('should return products from a specific category', async () => {
    const res = await request.get('/products-category?category=test');
    expect(res.status).toBe(200);
  });
  it('Should Show top products', async () => {
    const res = await request.get('/products/top');
    expect(res.status).toBe(200);
  });
});
