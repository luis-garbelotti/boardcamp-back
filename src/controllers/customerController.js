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

    const { name, phone, birthday, cpf } = req.body;
    
    try {

        const cpfCostumer = await connection.query(`
            SELECT * FROM customers
                WHERE customers.cpf = $1
        `, [ cpf ]
        );

        if (cpfCostumer.rowCount !== 0) {
            return res.sendStatus(409);
        }
        
        await connection.query(`
            INSERT INTO customers (name, phone, cpf, birthday)
                VALUES ($1, $2, $3, $4)
        `, [ name, phone, cpf, birthday ]);

        res.sendStatus(201);

    } catch (error) {
        
        res.sendStatus(500);

    }

}

export async function getCustomerById(req, res) {

    const { id } = req.params;

    try {

        const customer = await connection.query(`
            SELECT * FROM customers
                WHERE customers.id = $1
        `, [id]);

        if(customer.rowCount === 0) {

            return res.sendStatus(404);
            
        }
        
        res.send(formatDate(customer.rows));

    } catch (error) {
        
        res.sendStatus(500);

    }
    
}

export async function updateCustomer(req, res) {

    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    try {

        const customer = await connection.query(`
            SELECT * FROM customers
                WHERE customers.id = $1
        `, [id]);

        if(customer.rowCount === 0) {
            return res.sendStatus(401);
        }

        await connection.query(`
            UPDATE customers 
                SET 
                    name = $1, phone = $2, cpf = $3, birthday = $4
                WHERE customers.id = $5
        `, [ name, phone, cpf, birthday, id ])

        res.sendStatus(200);

    } catch (error) {
        
        res.sendStatus(500);
    }

}