import { createApp } from "./index.mjs";
import { MovieModel } from './models/local-file-system/movie.mjs'

createApp({ movieModel: MovieModel })
