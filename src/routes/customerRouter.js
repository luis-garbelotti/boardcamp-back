import { Router } from 'express';
import { getCustomers, insertCustomer, getCustomerById, updateCustomer } from '../controllers/customerController.js';
import validateCustomer from '../middlewares/validateCustomer.js';

const customerRouter = Router();

customerRouter.get('/customers', getCustomers)
customerRouter.post('/customers', validateCustomer, insertCustomer)
customerRouter.get('/customers/:id', getCustomerById)
customerRouter.put('/customers/:id', validateCustomer, updateCustomer)

export default customerRouter;