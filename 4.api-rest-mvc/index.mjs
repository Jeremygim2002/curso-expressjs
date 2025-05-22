import express from 'express';
import { moviesRouter } from './routes/movies.mjs';
import { corsMiddleware } from './middlewares/cors.mjs';

const app = express();

const port = 3000;

app.disable('x-powered-by');
app.use(express.json());
app.use(corsMiddleware());


// // traer todas las peliculas
// app.get('/movies', todo)

// // traer todas las peliculas por genero
// app.get('/movies/genero/', todo)


// // traer todas las peliculas por id
// app.get('/movies/:id', todo)

// // insertar nueva pelicula con post
// app.post('/movies/insertar', todo)


// // eliminar pelicula por id
// app.delete('/movies/:id', todo)


// // editar una parte de una pelicula
// app.patch('/movies/insertar/:id', todo)


app.use('/movies', moviesRouter)

app.listen(port, () => {
    console.log(`EL SERVIDOR ESTA CORRIENDO EN EL PUERTO http://localhost:${port}`)
})