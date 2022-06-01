import express, { Request, Response } from 'express';
import { Product, ProductModel } from '../models/products';
import { verifyAuthToken } from '../middleware/authenticate';

const product = new ProductModel();

const index = async (_req: Request, res: Response) => {
  const products = await product.index();
  res.status(200).json({ products });
};

const show = async (req: Request, res: Response) => {
  try {
    const result = await product.show(parseInt(req.params.id));
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ err });
  }
};
const create = async (req: Request, res: Response) => {
  try {
    const product_template: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };
    const new_product = await product.create(product_template);
    console.log(new_product);
    return res.status(200).json({ new_product });
  } catch (err) {
    res.status(400).json({ err });
  }
};
const filterByCategory = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const products = await product.filterByCategory(category);
    res.status(200).json({ products });
  } catch (err) {
    res.status(400).send(err);
  }
};
const topProducts = async (req: Request, res: Response) => {
  try {
    const products = await product.getTopProducts();
    res.status(200).json({ products });
  } catch (err) {
    res.status(400).json({ err });
  }
};

const product_routes = (app: express.Application) => {
  app.get('/products/top', topProducts);
  app.get('/products', index);
  app.get('/products/:id', show);
  app.get('/products-category', filterByCategory);
  app.post('/products', verifyAuthToken, create);
};

export default product_routes;
