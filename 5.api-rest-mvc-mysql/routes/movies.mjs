import { Router } from 'express';

import {  MovieController } from '../controllers/movies.mjs';


export const createMovieRouter = ({ movieModel }) => {

    const moviesRouter = Router();

    const movieController = new MovieController({ movieModel })

    // traer todas las peliculas 
    moviesRouter.get('/', movieController.getAll)

    // traer pelicula por id
    moviesRouter.get('/:id', movieController.getById)


    // insertar nueva pelicula con post
    moviesRouter.post('/', movieController.create)

    // eliminar pelicula por id
    moviesRouter.delete('/:id', movieController.delete)


    // editar una parte de una pelicula
    moviesRouter.patch('/:id', movieController.update)

    return moviesRouter

}