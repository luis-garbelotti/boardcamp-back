import connection  from "../db.js"

export async function getCategories(req, res) {

    try {
        
        const categories = await connection.query(
            `SELECT * FROM categories`
        )

        res.status(200).send(categories.rows);
    
    } catch (error) {

        res.sendStatus(500);    

    }

}

export async function insertCategory(req, res) {

    const { name } = req.body;

    try {
        
        await connection.query(
            `INSERT INTO categories (name) VALUES ($1)`, [name]
            )
        
        res.sendStatus(201); 
        
    } catch (error) {

        res.sendStatus(500)
    
    }

}