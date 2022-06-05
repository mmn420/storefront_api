import { Product, ProductModel } from '../../models/products';

const product_model = new ProductModel();

describe('product model test suite', () => {
  describe('Should countain the following methods', () => {
    it('Should have an index method', () => {
      expect(product_model.index).toBeDefined();
    });
    it('Should have a show method', () => {
      expect(product_model.show).toBeDefined();
    });
    it('Should have a create method', () => {
      expect(product_model.create).toBeDefined();
    });
    it('Should have a delete method', () => {
      expect(product_model.delete).toBeDefined();
    });
    it('Should have a filterByCategory method', () => {
      expect(product_model.filterByCategory).toBeDefined();
    });
    it('Should have a get top products method', () => {
      expect(product_model.getTopProducts).toBeDefined();
    });
  });
  describe('Check the return values of each method', () => {
    let test_product_model: Product = {
      name: 'test_product_model',
      price: 20,
      category: 'category',
    };

    it('Should create a new product', async () => {
      test_product_model = await product_model.create(test_product_model);
      expect(test_product_model.name).toBe('test_product_model');
    });
    it('Should index all products', async () => {
      const products = await product_model.index();
      expect(products).toBeInstanceOf(Object);
      expect(Object.keys(products).length).not.toBe(0);
    });
    it('Should return a product with a specific id', async () => {
      const product = await product_model.show(
        test_product_model.id as unknown as number
      );
      expect(product.name).toBe('test_product_model');
    });
    it('Should search by category and return the products in this category', async () => {
      const products = await product_model.filterByCategory('category');
      expect(products).toBeInstanceOf(Object);
      expect(Object.keys(products).length).not.toBe(0);
      expect(products[0].category).toBe('category');
    });
  });
});
