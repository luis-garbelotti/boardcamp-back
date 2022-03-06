import rentalSchema from "../schemas/rentalSchema.js";
import connection from "../db.js";

export default async function validateRental(req, res, next) {

    const validation = rentalSchema.validate(req.body)

    if(validation.error) {
        return res.sendStatus(400);
    }

    const customer = await connection.query(`
            SELECT * FROM customers
                WHERE customers.id = $1
        `, [req.body.customerId]);

    if (customer.rowCount === 0) {
        return res.sendStatus(400);
    }


    const game = await connection.query(`
            SELECT * FROM games
                WHERE games.id = $1
        `, [req.body.gameId]);

    if (game.rowCount === 0) {
        return res.sendStatus(400);
    }

    res.locals.game = game.rows[0];

    next();
}