import connection from "../db.js";
import customerSchema from "../schemas/customerSchema.js";

export default async function validateCustomer(req, res, next) {

    const validation = customerSchema.validate(req.body);

    if(validation.error) {
        return res.sendStatus(400)
    }

    const cpf = await connection.query(`
        SELECT * FROM customers
            WHERE customer.cpf = $1
    `, [req.body.cpf]
    );

    if(cpf.rowCount !== 0) {
        return res.sendStatus(409);
    }

    next();

}