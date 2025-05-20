import express from 'express';
import movies from './movies.json' with {type: 'json'};
import crypto from 'node:crypto'

const app = express();

const port = 3000;

app.disable('x-powered-by');
app.use(express.json());

// pantalla principal
app.get('/', (req, res) => {
    res.json({ message: 'Hola esta es la pantalla principal' })
})

// traer todas las peliculas
app.get('/movies', (req, res) => {
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

    res.status(404).json({ message: 'No se encontro la pelicula' })
})

// insertar nueva pelicula con PUT
app.post('/movies/insertar', (req, res) => {
    const { title, year, director, duration, poster, rate, genre } = req.body

    const newMovie = {
        id: crypto.randomUUID(),  //crea un id version 4
        title,
        year,
        director,
        duration,
        poster,
        rate: rate ?? 0,
        genre
    }

    //no es REST porque esta guardando el estado de la aplicacion en memoria
    movies.push(newMovie)

    res.status(201).json(newMovie)  //actualizar cache del cliente
})



app.listen(port, () => {
    console.log(`EL SERVIDOR ESTA CORRIENDO EN EL PUERTO http://localhost:${port}`)
})