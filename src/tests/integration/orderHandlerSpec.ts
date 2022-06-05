import { Order, orderProducts } from '../../models/orders';
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

describe('Testing orders endpoints', () => {
  let test_user: User;
  let test_order: Order;
  let token: string;
  let test_product2: Product;
  let test_product1: Product = {
    name: 'test_product',
    category: 'test',
    price: 20,
  };
  beforeAll(async () => {
    test_user = {
      firstName: 'fName',
      lastName: 'lName',
      username: 'ordertestuser',
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
    test_user = (await user_model.create(test_user)) as User;
    test_product1 = (await product_model.create(test_product1)) as Product;
    test_product2 = (await product_model.create(test_product2)) as Product;
    test_order = {
      user_id: test_user.id as unknown as number,
      status: 'active',
    };
  });
  it('Should create a new order', async () => {
    const res = await request
      .post('/orders')
      .send(test_order)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.new_order.status).toBe('active');
    test_order.id = res.body.new_order.id;
  });
  it('Should get an order by its id', async () => {
    const res = await request
      .get(`/orders/${test_order.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('active');
  });
  it('Should index all orders', async () => {
    const res = await request
      .get('/orders')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.length).not.toBe(0);
  });
  it('Should return all the orders made by this user', async () => {
    const res = await request
      .get(`/orders/user/${test_user.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.length).not.toBe(0);
  });
  it('Should add a product to the order', async () => {
    const order_products: orderProducts = {
      quantity: 3,
      order_id: test_order.id as unknown as number,
      product_id: test_product1.id as unknown as number,
    };
    const res = await request
      .post('/orders/addProduct')
      .send(order_products)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
  it('Should update the status of the order', async () => {
    const updated_order: Order = {
      id: test_order.id,
      user_id: test_user.id as unknown as number,
      status: 'complete',
    };
    console.log(updated_order);
    const res = await request
      .patch('/orders/update')
      .send({ order_id: 1, status: 'complete' })
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.updated_order.status).toBe('complete');
  });
  it('Should show all complete orders by a certain user', async () => {
    const res = await request
      .get(`/orders/complete/${test_user.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
