import express from 'express';
import { createMovieRouter } from './routes/movies.mjs';
import { corsMiddleware } from './middlewares/cors.mjs';


export const createApp = ({ movieModel }) => {

    const app = express();

    const port = 3000;

    app.disable('x-powered-by');
    app.use(express.json());
    app.use(corsMiddleware());

    app.use('/movies', createMovieRouter({ movieModel }))

    app.listen(port, () => {
        console.log(`EL SERVIDOR ESTA CORRIENDO EN EL PUERTO http://localhost:${port}`)
    })
}

