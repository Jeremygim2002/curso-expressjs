import {Router} from 'express';
import movies from './movies' with {type: 'json'};
import { validateMovie, validatePartialMovie } from './schemas/movies.mjs'
import { MovieModel } from '../models/movie.mjs';

export const moviesRouter = Router();

moviesRouter.get('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
    res.json(movies)
})


// traer todas las peliculas por genero
moviesRouter.get('/genero/', (req, res) => {
    const { genre } = req.query
    const movies = MovieModel.getAll({ genre })
    res.json(movies)
});


// traer pelicula por id
moviesRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    if (movie) {
        return res.json(movie)
    }

    res.status(404).json({ error: 'No se encontro la pelicula' })
})


// insertar nueva pelicula con post
moviesRouter.post('/insertar', async (req, res) => {

    const result = validateMovie(req.body)

    if (result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = await MovieModel.create({ input: result.data })

    res.status(201).json(newMovie)  //actualizar cache del cliente
})


// eliminar pelicula por id
moviesRouter.delete('/:id', async (req, res) => {
    const { id } = req.params

    const result = await MovieModel.delete({id})

    if (result === false) {
        return res.status(404).json({ message: 'Movie not found' })
    }

    return res.json({ message: 'Movie deleted' })
})


// editar una parte de una pelicula
moviesRouter.patch('/insertar/:id', async (req, res) => {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updateMovie = await MovieModel.update({ id, input: result.data })


    return res.json(updateMovie)
})