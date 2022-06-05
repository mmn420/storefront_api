import { Order, OrderModel, orderProducts } from '../../models/orders';
import { Product, ProductModel } from '../../models/products';
import { User, UserModel } from '../../models/users';

const user_model = new UserModel();
const order_model = new OrderModel();
const product_model = new ProductModel();

describe('order model test suite', () => {
  describe('Should countain the following methods', () => {
    it('Should have an index method', () => {
      expect(order_model.index).toBeDefined();
    });
    it('Should have a show method', () => {
      expect(order_model.show).toBeDefined();
    });
    it('Should have a create method', () => {
      expect(order_model.create).toBeDefined();
    });
    it('Should have a delete method', () => {
      expect(order_model.delete).toBeDefined();
    });
    it('Should have a updateStatus method', () => {
      expect(order_model.updateStatus).toBeDefined();
    });
    it('Should have a filterByUser method', () => {
      expect(order_model.filterByUser).toBeDefined();
    });
    it('Should have a filterByComplete method', () => {
      expect(order_model.filterByComplete).toBeDefined();
    });
    it('Should have an addProduct method', () => {
      expect(order_model.addProduct).toBeDefined();
    });
  });

  describe('Check the return values of each method', () => {
    let test_user: User = {
      firstName: 'fName',
      lastName: 'lName',
      username: 'test_user',
      password: 'testpw',
    };
    let test_order: Order;
    let test_product1: Product = {
      name: 'testproduct1',
      category: 'test',
      price: 20,
    };
    const test_product2: Product = {
      name: 'testproduct2',
      category: 'test',
      price: 15,
    };
    const test_product3: Product = {
      name: 'testproduct3',
      category: 'test',
      price: 30,
    };
    beforeAll(async () => {
      test_product1 = await product_model.create(test_product1);
      await product_model.create(test_product2);
      await product_model.create(test_product3);
      test_user = await user_model.create(test_user);
      test_order = {
        user_id: test_user.id as unknown as number,
        status: 'active',
      };
    });

    it('Should create a new order', async () => {
      test_order = (await order_model.create(test_order)) as Order;
      expect(test_order.status).toBe('active');
    });
    it('Should index all orders', async () => {
      const orders = await order_model.index();
      expect(orders).toBeInstanceOf(Object);
      expect(Object.keys(orders).length).not.toBe(0);
    });
    it('Should return a order with a specific id', async () => {
      const order = await order_model.show(test_order.id as unknown as number);
      expect(parseInt(order.user_id as unknown as string)).toBe(
        test_user.id as unknown as number
      );
    });
    it('Should search by user and return the orders made by this user', async () => {
      const orders = await order_model.filterByUser(
        test_user.id as unknown as number
      );
      expect(orders).toBeInstanceOf(Object);
      expect(Object.keys(orders).length).not.toBe(0);
      expect(parseInt(orders[0].user_id as unknown as string)).toBe(
        test_user.id as unknown as number
      );
    });
    it('Should add a product to the order', async () => {
      const new_orderproduct: orderProducts = await order_model.addProduct(
        3,
        test_order.id as unknown as number,
        test_product1.id as unknown as number
      );
      expect(parseInt(new_orderproduct.quantity as unknown as string)).toBe(3);
    });
  });
});
