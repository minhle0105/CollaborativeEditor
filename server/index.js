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
        origin: "http://localhost:3000",
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
                socket.emit("updated_data", result);
                console.log(`Request UPDATED handled at ${PORT} at ${new Date()} and send back to ${socket.id}`)
            }
        })
    })
    socket.on("getData", () => {
        db.query('SELECT * FROM docs', (error, result) => {
            if (error) {
                console.log(`Cannot get ${error}`);
            }
            else {
                socket.emit("get_new_data", result);
            }
        })
    })
})





const ipSet = new Set();


