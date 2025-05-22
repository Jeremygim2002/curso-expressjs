import express from 'express';
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


app.get('/', (req, res) => {
    res.json({ message: "Hola esta es la pantalla principal" })
})


app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})