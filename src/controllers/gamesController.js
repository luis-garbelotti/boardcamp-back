import connection from "../db.js";

export async function getGames(req, res) {

    try {
        
        if(req.query.name) {
  
            const games = await connection.query(`
                SELECT games.*, categories.name AS "categoryName" 
                FROM games
                    JOIN categories ON games."categoryId" = categories.id
                    WHERE lower(games.name) LIKE lower($1)
            `, [`${req.query.name}%`]);

            res.status(200).send(games.rows);

        } else {
  
            const games = await connection.query(`
                SELECT games.*, categories.name AS "categoryName" 
                FROM games
                    JOIN categories ON games."categoryId" = categories.id
            `);
        
            res.status(200).send(games.rows);
        
        }
        
    } catch (error) {
        
        res.sendStatus(500);

    }

}

export async function insertGame(req, res) {

    const newGame = req.body;
    const gameFormated = {
        ...newGame, 
        stockTotal: parseInt(newGame.stockTotal),
        pricePerDay: parseInt(newGame.pricePerDay) * 100
    }

    try {
        
        await connection.query(`
            INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
            VALUES ($1, $2, $3, $4, $5)
        `, [gameFormated.name, gameFormated.image, gameFormated.stockTotal, gameFormated.categoryId, gameFormated.pricePerDay]) 
    
        res.sendStatus(201);
        
    } catch (error) {

        res.sendStatus(500);
        
    }

}