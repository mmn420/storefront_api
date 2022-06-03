import client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category: string;
};

export class ProductModel {
  async index(): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get products. Error${err}`);
    }
  }
  async show(id: number): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot find product ${id}. Error${err}`);
    }
  }
  async create(product: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO Products (name ,price, category) VALUES ($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [
        product.name,
        product.price,
        product.category,
      ]);
      const new_product = result.rows[0];
      conn.release();
      return new_product;
    } catch (err) {
      throw new Error(`Cannot create product. Error${err}`);
    }
  }
  async delete(id: number): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
      const result = await conn.query(sql, [id]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Cannot delete Product. Error${err}`);
    }
  }
  async filterByCategory(category: string): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM products WHERE category=($1)';
      const result = await conn.query(sql, [category]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot find this category. Error${err}`);
    }
  }
  async getTopProducts(): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql =
        'SELECT products.name, SUM(ordersproduct.quantity) AS sum_quantity FROM products INNER JOIN ordersproduct ON products.id=ordersproduct.product_id GROUP BY products.name ORDER BY sum_quantity DESC LIMIT 5';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error('Something went wrong.');
    }
  }
}
