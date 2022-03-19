const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')

app.use(cors());
app.listen(3001, () => {
    console.log("Server is ready");
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
            console.log(error);
        } else {
            response.send(result);
        }
    })
})

app.put('/:id', (request, response) => {
    console.log(`Request UPDATE from ${request.ip} at ${new Date()}`);
    let id = request.params.id;
    let content = request.body.content;
    db.query('UPDATE docs SET content=(?) WHERE id=(?)', [content, id], (error, result) => {
        if (error) {
            console.log(error);
        } else {
            response.send(result);
        }
    })
})
