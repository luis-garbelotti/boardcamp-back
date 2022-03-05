import { Router } from 'express';
import { getCustomers, insertCustomer, getCustomerById } from '../controllers/customerController.js';
import validateCustomer from '../middlewares/validateCustomer.js';

const customerRouter = Router();

customerRouter.get('/customers', getCustomers)
customerRouter.post('/customers', validateCustomer, insertCustomer)
customerRouter.get('/customers/:id', getCustomerById)

export default customerRouter;