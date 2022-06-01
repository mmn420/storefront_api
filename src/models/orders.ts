import client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  status: string;
};

export class OrderModel {
  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get orders. Error${err}`);
    }
  }
  async show(id: number): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot find order ${id}. Error${err}`);
    }
  }
  async create(order: Order): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = 'INSERT INTO orders (user_id , status) VALUES ($1, $2)';
      const result = await conn.query(sql, [order.user_id, order.status]);
      const new_order = result.rows[0];
      conn.release();
      return new_order;
    } catch (err) {
      throw new Error(`Cannot create order. Error${err}`);
    }
  }
  async delete(id: number): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM orders WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      const deleted_order = result.rows[0];
      conn.release();
      return deleted_order;
    } catch (err) {
      throw new Error(`Cannot delete order. Error${err}`);
    }
  }
  async updateStatus(order_id: number, status: string): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = 'UPDATE orders SET status=($1) WHERE id=($2)';
      const result = await conn.query(sql, [status, order_id]);
      const updated_order = result.rows[0];
      conn.release();
      return updated_order;
    } catch (err) {
      throw new Error(`Cannot update order status. Error${err}`);
    }
  }
  async filterByUser(user_id: number): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders WHERE user_id=($1)';
      const result = await conn.query(sql, [user_id]);
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot find orders by this user. Error${err}`);
    }
  }
  async filterByComplete(user_id: number): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';
      const result = await conn.query(sql, [user_id, 'complete']);
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot find orders by this user. Error${err}`);
    }
  }
  async addProduct(
    quantity: number,
    order_id: number,
    product_id: number
  ): Promise<Order> {
    try {
      const ordersql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await client.connect();

      const result = await conn.query(ordersql, [order_id]);

      const order = result.rows[0];

      if (order.status !== 'active') {
        throw new Error(
          `Could not add product ${product_id} to order ${order_id} because order status is ${order.status}`
        );
      }

      conn.release();
    } catch (err) {
      throw new Error(`${err}`);
    }
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO ordersProduct (quantity, order_id, product_id) VALUES ($1, $2, $3)';
      const result = await conn.query(sql, [quantity, order_id, product_id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(
        `Could not add product ${product_id} to order ${order_id}: ${err}`
      );
    }
  }
}
