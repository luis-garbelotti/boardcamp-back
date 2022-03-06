import connection from '../db.js';
import daysjs from 'dayjs';
import SqlString from 'sqlstring';
import dayjs from 'dayjs';

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

export async function returnRental(req, res) {

    const {id} = req.params;
    const returnedDay = dayjs().format('YYYY-MM-DD');

    try {
        
        const rental = await connection.query(`
            SELECT * FROM rentals
                WHERE id = $1
        `, [id]);

        if(rental.rowCount === 0) {
            return res.sendStatus(404);
        }

        if(rental.rows[0].returnDate !== null) {
            return res.sendStatus(400);
        }  

        const game = await connection.query(`
            SELECT * FROM games
            WHERE games.id = $1
        `, [rental.rows[0].gameId])

        const delayDays = dayjs(dayjs(returnedDay) - dayjs(rental.rows[0].rentDate) - (rental.rows[0].daysRented * 86400000)) / 86400000
        
        let fee = null;
        if(delayDays > 0) {
            
            fee = delayDays * game.rows[0].pricePerDay;
            
        }

        await connection.query(`
                UPDATE rentals 
                SET 
                    "returnDate" = $1,
                    "delayFee" = $2
                WHERE id = $3
            `, [ returnedDay, fee, id ]);

        res.sendStatus(200);

    } catch (error) {

        res.sendStatus(500);

    }

}