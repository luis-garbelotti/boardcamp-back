import { Router } from 'express';
import { getRentals, insertRental, returnRental, deleteRental } from '../controllers/rentalsController.js';
import validateRental from '../middlewares/validateRental.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', validateRental, insertRental);
rentalsRouter.post('/rentals/:id/return', returnRental);
rentalsRouter.delete('/rentals/:id', deleteRental);

export default rentalsRouter;