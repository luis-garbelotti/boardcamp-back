import joi from 'joi';

const rentalSchema = joi.object({
    customerId: joi.number().integer().greater(0).required(),
    gameId: joi.number().integer().greater(0).required(),
    daysRented: joi.number().integer().greater(0).required(),
});

export default rentalSchema;