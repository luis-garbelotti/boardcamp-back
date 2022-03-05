import { Router } from "express";
import { getGames, insertGame } from "../controllers/gamesController.js";
import { validateGames } from "../middlewares/validateGames.js";

const gamesRouter = Router();

gamesRouter.get('/games', getGames);
gamesRouter.post('/games', validateGames, insertGame);

export default gamesRouter;