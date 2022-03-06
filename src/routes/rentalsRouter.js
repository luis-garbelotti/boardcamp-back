import { Router } from 'express';
import { getRentals, insertRental } from '../controllers/rentalsController.js';
import validateRental from '../middlewares/validateRental.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', validateRental, insertRental);
rentalsRouter.post('/rentals/:id/return');
rentalsRouter.delete('/rentals/:id');

export default rentalsRouter;