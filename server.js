//HEROKU
const PORT = process.env.PORT || 4000
//IMPORTS
const helmet = require('helmet')
const cors = require('cors')
//EXPRESS
const express = require('express')
const app = express()
//CREATE HTTP SERVER
const server = require('http').Server(app)
//CREATE SOCKET.IO SERVER
const io = require('socket.io')(server)
//MIDDLEWARE
app.use(helmet())
app.use(cors())
app.use(express.json())

server.listen(PORT, () => {
    console.log(`***Server is listening on port: ${PORT}***`)
})

//DEFAULT ROUTE
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the ChickenRiot server!</h1>')
})

//MEMORY 
const connectedClients = []

//DEFAULT SOCKET CODE
io.on('connect', (socket) => {
    console.log('A user has connected!')
    //GET ROOM FROM CLIENT ('/asedf@!@34d')
    let room = ''
    socket.on('room', (newRoom) => { 
        room = newRoom
    })
    console.log(room);
    //JOIN CUSTOM ROOM
    socket.join(`${room}`)
    //LIST OF CONNECTED CLIENTS 
    connectedClients.push(Object.keys(io.sockets.sockets))
    io.to(`${room}`).emit('client connected', connectedClients)
    //SEND & RECIEVE MESSAGES
    socket.on('chat message', (user, msg) => {
        io.to(`${room}`).emit('chat message', (user + ': ' + msg))
    });
    socket.on('disconnect', () => {
        console.log('A user has disconnected!')
        io.removeAllListeners('connection')
        io.removeAllListeners('disconnect')
    })
})

//CUSTOM NAMESPACES 
// const cnsp = io.of(`${namespace}`)
// cnsp.on('connection', (socket) => {
//     console.log(`A user connect to custom namespace" ${namespace}`)
// })