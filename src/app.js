import express, { json } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(json());

app.listen(4000, () => {
    console.log('Listening on 4000')
})