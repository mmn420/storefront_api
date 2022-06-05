import { UserModel, User } from '../../models/users';

const user_model = new UserModel();

describe('User model test suite', () => {
  describe('Should countain the following methods', () => {
    it('Should have an index method', () => {
      expect(user_model.index).toBeDefined();
    });
    it('Should have a show method', () => {
      expect(user_model.show).toBeDefined();
    });
    it('Should have a create method', () => {
      expect(user_model.create).toBeDefined();
    });
    it('Should have a delete method', () => {
      expect(user_model.delete).toBeDefined();
    });
    it('Should have an authenticate method', () => {
      expect(user_model.authenticate).toBeDefined();
    });
  });
  describe('Check the return values of each method', () => {
    let new_user: User;
    const test_user: User = {
      firstName: 'fName',
      lastName: 'lName',
      username: 'testuser',
      password: 'testpassword',
    };

    it('Should create a new user', async () => {
      new_user = await user_model.create(test_user);
      expect(new_user.username).toBe(test_user.username);
    });
    it('Should index all users', async () => {
      const users = await user_model.index();
      expect(users).toBeInstanceOf(Object);
      expect(Object.keys(users).length).not.toBe(0);
    });
    it('Should return a user with a specific id', async () => {
      const user = await user_model.show(new_user.id as unknown as number);
      expect(user.username).toBe(test_user.username);
    });
    it('Should authenticate the user and return the username if the password is correct', async () => {
      const user = (await user_model.authenticate(
        test_user.username,
        test_user.password
      )) as User;
      expect(user.username).toBe(test_user.username);
    });
  });
});
