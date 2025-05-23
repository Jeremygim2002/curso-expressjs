import { createApp } from "./index.mjs";
import { MovieModel } from './models/mysql/movie.mjs'

createApp({ movieModel: MovieModel })
