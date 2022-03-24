const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')

app.use(cors());

const PORT = process.env.PORT;
if (!PORT) {
    throw new Error("No PORT provided");
}

app.listen(PORT, () => {
    console.log(`Server listens on ${PORT}`);
})
app.use(express.json())

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'minhle123',
    database: 'CollaborativeEditing',
});

const ipSet = new Set();

app.get('/', (request, response) => {
    if (!ipSet.has(request.ip)) {
        ipSet.add(request.ip);
        console.log(`Request GET from ${request.ip} at ${new Date()}`);
    }
    db.query('SELECT * FROM docs', (error, result) => {
        if (error) {
            response.status(404).send();
            console.log(error);
        } else {
            response.status(200).send(result);
            console.log(`Request GET handled at ${PORT} at ${new Date()} and send back to ${request.ip}`)
        }
    })
})

app.put('/:id', (request, response) => {
    console.log(`Request UPDATE sent from ${request.ip} at ${new Date()}`);
    let id = request.params.id;
    let content = request.body.content;
    db.query('UPDATE docs SET content=(?) WHERE id=(?)', [content, id], (error, result) => {
        if (error) {
            response.status(400).send();
            console.log(error);
        } else {
            response.status(201).send(result);
            console.log(`Request UPDATED handled at ${PORT} at ${new Date()} and send back to ${request.ip}`)
        }
    })
})
