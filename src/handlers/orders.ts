import express, { Request, Response } from 'express';
import { OrderModel, Order } from '../models/orders';
import { verifyAuthToken } from '../middleware/authenticate';

const order = new OrderModel();

const index = async (_req: Request, res: Response) => {
  const orders = await order.index();
  res.status(200).json({ orders });
};

const show = async (req: Request, res: Response) => {
  try {
    const result = await order.show(parseInt(req.params.id));
    if (!result) {
      res.status(404).send('User not found');
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    res.status(400).json({ err });
  }
};
const create = async (req: Request, res: Response) => {
  try {
    const order_template: Order = {
      user_id: req.body.user_id,
      status: req.body.status,
    };
    const new_order = await order.create(order_template);
    return res.status(200).json({ new_order });
  } catch (err) {
    res.status(400).json({ err });
  }
};
const delete_order = async (req: Request, res: Response) => {
  try {
    const deleted_order = await order.delete(parseInt(req.params.id));
    if (!deleted_order) {
      res.status(404).send('Order not found');
    } else {
      res.status(200).json({ deleted_order });
    }
  } catch (err) {
    res.status(400).json({ err });
  }
};
const orderByUser = async (req: Request, res: Response) => {
  try {
    const orders = await order.filterByUser(parseInt(req.params.user_id));
    res.status(200).json({ orders });
  } catch (err) {
    res.status(400).json({ err });
  }
};
const completeOrders = async (req: Request, res: Response) => {
  try {
    const orders = await order.filterByComplete(parseInt(req.params.user_id));
    res.status(200).json({ orders });
  } catch (err) {
    res.status(400).json({ err });
  }
};
const addProductToOrder = async (req: Request, res: Response) => {
  try {
    const added_product = await order.addProduct(
      parseInt(req.body.quantity),
      parseInt(req.body.order_id),
      parseInt(req.body.product_id)
    );
    res.status(200).json({ added_product });
  } catch (err) {
    res.status(400).json({ err });
  }
};

const updateStatus = async (req: Request, res: Response) => {
  try {
    if (req.body.status != 'active' && req.body.status != 'complete') {
      res
        .status(400)
        .send(
          'Invalid status please send "active" or "complete" as the status'
        );
    } else {
      const updated_order = await order.updateStatus(
        parseInt(req.body.order_id),
        req.body.status
      );
      res.status(200).json({ updated_order });
    }
  } catch (err) {
    res.status(400).json({ err });
  }
};

const order_routes = (app: express.Application) => {
  app.get('/orders', verifyAuthToken, index);
  app.get('/orders/:id', verifyAuthToken, show);
  app.get('/orders/user/:user_id', verifyAuthToken, orderByUser);
  app.get('/orders/complete/:user_id', verifyAuthToken, completeOrders);
  app.delete('/orders/:id', verifyAuthToken, delete_order);
  app.post('/orders', verifyAuthToken, create);
  app.patch('/orders/update', verifyAuthToken, updateStatus);
  app.post('/orders/addProduct', verifyAuthToken, addProductToOrder);
};

export default order_routes;
