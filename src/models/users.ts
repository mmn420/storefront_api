import client from '../database';
import { compare_hash, generate_hash } from '../utilities/hash';
export type User = {
  id?: number;
  firstName?: string;
  lastName?: string;
  username: string;
  password: string;
};

export class UserModel {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get users. Error${err}`);
    }
  }
  async show(id: number): Promise<User> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot find user ${id}. Error${err}`);
    }
  }
  async create(user: User): Promise<User> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO users (firstName , lastName,username,  password) VALUES ($1, $2, $3, $4)';
      const hashed_password = generate_hash(user.password);
      const result = await conn.query(sql, [
        user.firstName,
        user.lastName,
        user.username,
        hashed_password,
      ]);
      const new_user = result.rows[0];
      conn.release();
      return new_user;
    } catch (err) {
      throw new Error(`Cannot create user. Error${err}`);
    }
  }
  async delete(id: number): Promise<User> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM users WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      const deleted_user = result.rows[0];
      conn.release();
      return deleted_user;
    } catch (err) {
      throw new Error(`Cannot delete user. Error${err}`);
    }
  }
  async authenticate(
    username: string,
    passowrd: string
  ): Promise<User | Error> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM users WHERE username=($1)';
      const result = await conn.query(sql, [username]);
      if (result.rows[0]) {
        const user = result.rows[0];
        const password_check = compare_hash(passowrd, user.passowrd);
        if (!password_check) {
          return new Error(`Invalid Password`);
        }
        return user;
      } else {
        return new Error(`Invalid username ${username}`);
      }
    } catch (err) {
      throw new Error(`Cannot find user. Error${err}`);
    }
  }
}