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
const searchTerm = []

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
    const messages = []
    //LOAD LIST OF MESSAGES
    socket.emit('allchat', (messages))
    //SEND USER ID
    socket.emit('userId', (socket.id))
    //LIST OF CONNECTED CLIENTS
    connectedClients.push(Object.keys(io.sockets.sockets))
    io.to(`${room}`).emit('client connected', Object.keys(io.sockets.sockets))
    //SEND & RECIEVE MESSAGES
    socket.on('chat message', (user, msg) => {
        messages.push(msg)
        console.log(`${msg} from room ${room}`);
        io.emit('chat message', (user + ': ' + msg))
    })
    //ANIMATION
    socket.on('animate', (id, type) => {
        io.emit('animate', ({id: id, type: type}))  
    })
    //YOUTUBE 
    socket.on('iframe', (data) => {
        const regex = /\=(.*)/.exec(data)[1]
        console.log(regex)
        searchTerm.push(regex)
        io.emit('iframe', regex)
    })
    //SYNC ALL ROOMS
    socket.on('sync', () => {
        if(searchTerm.length > 0) {
        const term = searchTerm.slice(searchTerm.length - 1)
        console.log(term)
        io.emit('sync', `https://www.youtube.com/watch?v=${term}`)
        } else {
            io.emit('sync', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ') //YOU'VE BEEN RICK ROLLED
        }
    })
    socket.on('disconnect', () => {
        console.log('A user has disconnected!')
        io.emit('client connected', (Object.keys(io.sockets.sockets)))
        io.removeAllListeners('connection')
        io.removeAllListeners('disconnect')
    })
})

//CUSTOM NAMESPACES 
// const cnsp = io.of(`${namespace}`)
// cnsp.on('connection', (socket) => {
//     console.log(`A user connect to custom namespace" ${namespace}`)
// })