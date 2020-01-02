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

//SOCKET CODE
io.on('connect', (socket) => {
    console.log('A user has connected!')
    //LIST OF CONNECTED CLIENTS 
    connectedClients.push(Object.kets(io.sockets.sockets))
    io.emit('client connected', connectedClients)
    socket.on('disconnect', () => {
        console.log('A user has disconnected!')
        io.removeAllListeners('connection')
        io.removeAllListeners('disconnect')
    })
})