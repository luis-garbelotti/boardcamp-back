import connection from '../db.js';
import daysjs from 'dayjs';
import SqlString from 'sqlstring';

export async function getRentals(req, res) {

    try {

        let where = '';
        
        if(req.query.customerId) {
            where = `WHERE "customerId" = ${SqlString.escape(req.query.customerId)}`
        }

        if (req.query.gameId) {
            where = `WHERE "gameId" = ${SqlString.escape(req.query.gameId)}`
        }

        const rentals = await connection.query(`
                SELECT 
                    rentals.*, 
                    customers.id AS "idCustomer", customers.name AS "nameCustomer",
                    games.id AS "idGame", games.name AS "nameGame", games."categoryId",
                    categories.name AS "categoryName"
                FROM 
                    rentals
                JOIN 
                    customers ON customers.id = rentals."customerId"
                JOIN 
                    games ON games.id = rentals."gameId"
                JOIN 
                    categories ON games."categoryId" = categories.id
                ${where}
            `
        );
       

        res.send(rentals.rows.map((row) => {

            const { id, customerId, gameId, rentDate, daysRented, returnDate, originalPrice,
               delayFee, idCustomer, nameCustomer, idGame, nameGame, categoryId, categoryName } = row;
           
            return {
               id,
               customerId,
               gameId,
               rentDate,
               daysRented,
               returnDate,
               originalPrice,
               delayFee,
               costumer: {
                   id: idCustomer,
                   name: nameCustomer
               },
               game: {
                   id: idGame,
                   name: nameGame,
                   categoryId,
                   categoryName
               }
            }
        }));

    } catch (error) {
        
        res.sendStatus(500);

    }

}

export async function insertRental(req, res) {

    const { customerId, gameId, daysRented } = req.body;
    const game = res.locals.game;
    
    try {

        const gamesRented = await connection.query(`
            SELECT * FROM rentals
                WHERE "gameId" = $1
                AND "returnDate" IS NULL
        `, [gameId]);

        if(gamesRented.rowCount === game.stockTotal) {
            return res.sendStatus(400);
        } 

        await connection.query(`
            INSERT INTO 
                rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
                VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
                customerId, 
                gameId, 
                daysjs().format('YYYY-MM-DD'),
                daysRented,
                null,
                game.pricePerDay * daysRented,
                null
            ]
        ); 

        res.sendStatus(201);  
        
    } catch (error) {
        
        res.sendStatus(500);
        
    }

}