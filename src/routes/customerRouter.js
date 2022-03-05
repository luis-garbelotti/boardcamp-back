import { Router } from 'express';
import { getCustomers, insertCustomer } from '../controllers/customerController.js';
import validateCustomer from '../middlewares/validateCustomer.js';

const customerRouter = Router();

customerRouter.get('/customers', getCustomers)
customerRouter.post('/customers', validateCustomer, insertCustomer)

export default customerRouter;