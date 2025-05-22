import express from 'express';
import movies from './movies.json' with {type: 'json'};
import crypto from 'node:crypto'
import { validateMovie, validatePartialMovie } from './schemas/movies.mjs'
import cors from 'cors'

const app = express();

const port = 3000;

app.disable('x-powered-by');
app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:8080',
            'http://localhost:3000',
            'https://movies.com',
        ]

        if (ACCEPTED_ORIGINS.includes(origin)) {
            return callback(null, true)
        }

        if (!origin) {
            return callback(null, true)
        }

        return callback(new Error('Not allowed by CORS'))
    }
}))

// pantalla principal
app.get('/', (req, res) => {
    res.json({ message: 'Hola esta es la pantalla principal' })
})

// traer todas las peliculas
app.get('/movies', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
    res.json(movies)
})

// traer todas las peliculas por genero
app.get('/movies/genero/', (req, res) => {
    const { genre } = req.query

    if (genre) {
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }
    res.json(movies)
});

// traer todas las peliculas por id
app.get('/movies/:id', (req, res) => {
    const { id, mas, otro } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)

    res.status(404).json({ error: 'No se encontro la pelicula' })
})

// insertar nueva pelicula con PUT
app.post('/movies/insertar', (req, res) => {

    const result = validateMovie(req.body)

    if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = {
        id: crypto.randomUUID(),  //crea un id version 4
        ...result.data
    }

    movies.push(newMovie);

    //no es REST porque esta guardando el estado de la aplicacion en memoria

    res.status(201).json(newMovie)  //actualizar cache del cliente
})

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' })
    }

    movies.splice(movieIndex, 1)

    return res.json({ message: 'Movie deleted' })
})



app.patch('/movies/insertar/:id', (req, res) => {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' })
    }

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie

    return res.json(updateMovie)
})



app.listen(port, () => {
    console.log(`EL SERVIDOR ESTA CORRIENDO EN EL PUERTO http://localhost:${port}`)
})