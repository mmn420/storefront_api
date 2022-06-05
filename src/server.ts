import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import user_routes from './handlers/users';
import product_routes from './handlers/products';
import order_routes from './handlers/orders';

const app: express.Application = express();
const address = 'http://localhost:3000';

const corsOptions = {
  origin: 'http://localhost:3000',
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(bodyParser.json());

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});
user_routes(app);
product_routes(app);
order_routes(app);
const server = app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
export { server, app };
