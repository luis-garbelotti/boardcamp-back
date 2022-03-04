import categorySchema from "../schemas/categorySchema.js";
import connection from "../db.js";

export default async function validateCategory(req, res, next) {
    const validation = categorySchema.validate(req.body);

    if(validation.error) {
        return res.sendStatus(400);
    }

    const category = await connection.query(
        `SELECT * FROM categories WHERE name = $1`
        , [req.body.name]
        );

    if (category.rowCount !== 0) {

        return res.sendStatus(409);

    }

    next();
}