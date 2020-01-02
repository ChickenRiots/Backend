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
    // const messages = []
    // //LOAD LIST OF MESSAGES
    // socket.emit('allchat', (messages))
    //LIST OF CONNECTED CLIENTS
    connectedClients.push(Object.keys(io.sockets.sockets))
    io.to(`${room}`).emit('client connected', Object.keys(io.sockets.sockets))
    //SEND & RECIEVE MESSAGES
    socket.on('chat message', (user, msg) => {
        //
        // messages.push(msg)
        console.log(msg);
        socket.emit('chat message', (user + ': ' + msg))
    })
    //ANIMATION
    socket.on('animate', (id, type) => {
        socket.emit('animate', ({id: id, type: type}))
    })
    //YOUTUBE
    // socket.on('get title', function(data, callback) {
    //     var videoId = data.videoId
    //     var user = data.user
    
    //     $.get(
    //         "https://www.googleapis.com/youtube/v3/videos", {
    //             part: 'snippet',
    //             id: videoId,
    //             key: data.api_key
    //         },
    //         function(data) {
    //             // enqueueNotify(user, data.items[0].snippet.title)
    //             socket.emit('notify alerts', {
    //                 alert: 0,
    //                 user: user,
    //                 title: data.items[0].snippet.title
    //             })
    //             // Does a callback and returns title
    //             callback({
    //                 videoId: videoId,
    //                 title: data.items[0].snippet.title
    //             })
    //         }
    //     )
    // })
    
    // socket.on('get playlist videos', function(data) {
    //     var playlistId = data.playlistId
    //     var user = data.user
    
    //     $.get(
    //         "https://www.googleapis.com/youtube/v3/playlistItems", {
    //             part: 'snippet,contentDetails',
    //             playlistId: playlistId,
    //             maxResults: '50',
    //             key: data.api_key
    //         },
    //         function(data) {
    //           // Iterate through all of the playlist videos
    //           for (let video of data.items) {
    //             enqueueVideo(roomnum, video.contentDetails.videoId)
    //           }
    //         }
    //     )
    // })
    socket.on('disconnect', () => {
        console.log('A user has disconnected!')
        io.emit('client connected', (connectedClients.splice(connectedClients.indexOf(Object.keys(io.sockets.sockets), 1))))
        io.removeAllListeners('connection')
        io.removeAllListeners('disconnect')
    })
})

//CUSTOM NAMESPACES 
// const cnsp = io.of(`${namespace}`)
// cnsp.on('connection', (socket) => {
//     console.log(`A user connect to custom namespace" ${namespace}`)
// })