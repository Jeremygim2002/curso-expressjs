import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'moviesdb'
}

const connection = await mysql.createConnection(config)



export class MovieModel {
    static async getAll({ genre }) {
        let query = `
                SELECT 
                     m.title,
                     m.year,
                     m.director,
                     m.duration,
                     m.poster,
                     m.rate,
                     BIN_TO_UUID(m.id) AS id,
                     GROUP_CONCAT(g.name) AS genres
                FROM movie m
                LEFT JOIN movie_genres mg ON m.id = mg.movie_id
                LEFT JOIN genre g ON mg.genre_id = g.id
        `;

        const params = [];

        if (genre) {
            query += ` WHERE g.name = ?`;
            params.push(genre);
        }

        query += `
                GROUP BY m.id
                ORDER BY m.title;
        `;

        const [movies] = await connection.query(query, params);
        return movies;
    }


    static async getById({ id }) {
        const [movies] = await connection.query(
            `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?);`,
            [id]
        )

        if (movies.length === 0) return null

        return movies[0]
    }


    static async create({ input }) {
        const {
            genre: genreInput, // genre is an array
            title,
            year,
            duration,
            director,
            rate,
            poster
        } = input

        // todo: crear la conexión de genre

        // crypto.randomUUID()
        const [uuidResult] = await connection.query('SELECT UUID() uuid;')
        const [{ uuid }] = uuidResult

        try {
            await connection.query(
                `INSERT INTO movie (id, title, year, director, duration, poster, rate)
          VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
                [title, year, director, duration, poster, rate]
            )
        } catch (e) {
            // puede enviarle información sensible
            throw new Error('Error creating movie')
            // enviar la traza a un servicio interno
            // sendLog(e)
        }

        const [movies] = await connection.query(
            `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?);`,
            [uuid]
        )

        return movies[0]
    }

    static async delete({ id }) {

    }

    static async update({ id, input }) {

    }


}