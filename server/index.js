const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')

app.use(cors());
app.use(express.json())
// const PORT = process.env.PORT;
const PORT = 3002;

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'minhle123',
    database: 'CollaborativeEditing',
});

const server = http.createServer(app).listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
const io = new Server(server, {
    cors: {
        origin: "http://192.168.0.122:3000",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
})
io.on("connection", (socket) => {
    socket.on("edit", (data) => {
        let id = data.id;
        let text = data.text;
        db.query('UPDATE docs SET content=(?) WHERE id=(?)', [text, id], (error, result) => {
            if (error) {
                console.log(`Cannot update ${error}`);
            } else {
                db.query('SELECT * FROM docs', (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        socket.broadcast.emit("updated_data", result[0].content);
                    }
                })
                console.log(`Request UPDATED handled at ${PORT} at ${new Date()} and send back to ${socket.id}`)
            }
        })
    })
})


app.get('/data', (request, response) => {
    db.query('SELECT * FROM docs;', (error, result) => {
        if (error) {
            console.log(error);
        } else {
            response.send(result)
        }
    })
})

const ipSet = new Set();


