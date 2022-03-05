import gamesSchema from "../schemas/gamesSchema.js";
import connection from "../db.js";

export async function validateGames(req, res, next) {

    const validation = gamesSchema.validate(req.body);

    if(validation.error) {
        return res.sendStatus(400);
    }

    if (parseInt(req.body.stockTotal) <= 0 || parseInt(req.body.pricePerDay) <= 0) {
        return res.sendStatus(400)
    }

    const category = await connection.query(`
            SELECT * FROM categories 
                WHERE categories.id = $1
        `, [req.body.categoryId]);

    if (category.rowCount === 0) {
        return res.sendStatus(400);
    }

    const name = await connection.query(`
            SELECT * FROM games 
                WHERE lower(name) LIKE lower($1)
        `, [`%${req.body.name}%`]);
    
    if(name.rowCount !== 0 ){
        return res.sendStatus(409);
    }

    next();

}