import connection from "../db.js";
import formatDate from "../utils/formatDate.js";

export async function getCustomers(req, res) {

    try {

        if(req.query.cpf) {

            const customers = await connection.query(`
                SELECT * FROM customers
                    WHERE cpf LIKE $1
            `, [`${req.query.cpf}%`]);

            return res.status(200).send(formatDate(customers.rows));

        }
        
        const customers = await connection.query(`
            SELECT * FROM customers
        `);

        res.status(200).send(formatDate(customers.rows));

    } catch (error) {
        
        res.sendStatus(500);

    }

}

export async function insertCustomer(req, res) {

    const customer = req.body;
    
    try {
        
        await connection.query(`
            INSERT INTO customers (name, phone, cpf, birthday)
                VALUES ($1, $2, $3, $4)
        `, [ customer.name, customer.phone, customer.cpf, customer.birthday ]);

        res.sendStatus(201);

    } catch (error) {
        
        res.sendStatus(500);

    }

}
