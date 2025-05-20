import express from 'express';
import ditto from './ditto.json' with {type: 'json'};

const app = express();

app.disable('x-powered-by')

const port = 1234;

app.use(express.json())

// app.use((req, res, next) => {
//     if (req.method !== 'POST') return next()
//     if (req.headers['content-type'] !== 'application/json') return next()

//     //Solo llegan las request que son POST y que tienen el header Content-Type: application/json    
//     let body = ''

//     // escuchar el evento data
//     req.on('data', chunk => {
//         body += chunk.toString()
//     })

//     req.on('end', () => {
//         const data = JSON.parse(body)
//         data.timestamp = Date.now()
//         // mutar la request y meter la informacion en el req.body
//         req.body = data
//         next()
//     })
// })

app.get('/traerpokemon', (req, res) => {
    res.json(ditto)
})

app.post('/enviarpokemon', (req, res) => {
    res.status(201).json(req.body)
})


// La ultima a lo q va llegar, al usar el use signnifica que va a pasar por todos los metodos http(get, post, put, delete) y este es el ultimo si todo lo demas falla
app.use((req, res) => {
    res.status(404).send('<h1>Error 404</h1>')
})

app.listen(port, () => {
    console.log(`EL SERVIDOR ESTA CORRIENDO EN EL PUERTO http://localhost:${port}`)
})


