const { Server, Socket } = require('socket.io')
import express from 'express'
import http from 'http'

interface ChatMessage {
  roomName: string[]
  text: string
  sender: string
}

interface UserInfo {
  email: string
  socketId: string
}

interface Player {
  id: string
  x: number
  y: number
}

const onlineUsers: UserInfo[] = []
const players: Record<string, Player> = {}
let mapCords: { x: number; y: number }[] = []

export function setupSocketIO(
  httpServer: http.Server,
  app: express.Application
) {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        'https://pawgilkrog.dk',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
      ],
      methods: ['GET', 'POST', 'PUT'],
    },
  })

  io.on('connection', async (socket: typeof Socket) => {
    socket.on('authendicate', handleAuthendication(socket))

    // Chat sockets
    socket.on('joinRoom', handleJoinRoom(socket, io))
    socket.on('chatMessage', handleChatMessage(socket, io))
    socket.on('chatDisconnect', handleDisconnect(socket))

    // Game
    socket.on('joinGame', () => {
      players[socket.id] = { id: socket.id, x: 200, y: 200 }
      socket.broadcast.emit('newPlayer', players[socket.id])
      socket.emit('yourPlayerNumber', Object.keys(players).length)
      socket.emit('mapCords', mapCords)
      socket.emit('startGame')
    })

    socket.emit('currentPlayers', players)

    socket.on('move', (data: { x: number; y: number }) => {
      if (players[socket.id]) {
        players[socket.id].x = data.x
        players[socket.id].y = data.y
        socket.broadcast.emit('playerMoved', {
          id: socket.id,
          x: data.x,
          y: data.y,
        })
      }
    })

    socket.on('mapCreated', (data: any) => {
      console.log('Map created:', data)
      mapCords = data
      // socket.broadcast.emit('getMap', data)
    })

    socket.on('placeBomb', (data: { x: number; y: number }) => {
      socket.broadcast.emit('bombPlaced', data)
      socket.emit('bombPlaced', data)
    })

    socket.on('playerDied', (data: { id: string }) => {
      if (players[data.id] != undefined) {
        socket.broadcast.emit('playerDied', data)
        socket.emit('playerDied', data)
      }
    })

    socket.on('disconnect', () => {
      delete players[socket.id]
      socket.broadcast.emit('playerDisconnected', socket.id)
    })

    socket.on('error', function (err: any) {
      console.log('ERror happened', err)
    })
  })

  // API endpoint to get the list of online users
  app.get('/api/online-users', (req: any, res: any) => {
    const onlineUserEmails = onlineUsers.map((user) => user.email)
    res.json(onlineUserEmails)
  })
}

const handleAuthendication = (socket: typeof Socket) => (email: string) => {
  // Create a user object with socketid and email
  const userInfo: UserInfo = {
    email: email,
    socketId: socket.id,
  }

  // Check if the user is already in the onlineUsers array
  const userIndex = onlineUsers.find((user) => user.email === email)
  if (!userIndex) {
    // If user does not already exist add it to the array
    onlineUsers.push(userInfo)
    // Emit that the specified user is online
    socket.broadcast.emit(
      'userOnline',
      onlineUsers.map((user) => user.email)
    )
  }
}

const handleJoinRoom =
  (socket: typeof Socket, io: typeof Server) => (roomUsers: string[]) => {
    // check the array of users online from roomUsers
    const usersOnline = roomUsers.every((user) =>
      onlineUsers.some((onlineUser) => onlineUser.email === user)
    )

    // If usersOnline is not undefined or null
    if (usersOnline) {
      // create the room for the two users
      socket.join(roomUsers.join('-'))
      io.to(roomUsers.join('-')).emit('chatMessage', {
        id: -1,
        text: `Room created with ${roomUsers.join(' and ')}`,
        sender: 'System',
      })
    }
  }

const handleChatMessage =
  (socket: typeof Socket, io: typeof Server) => (data: ChatMessage) => {
    // Get the roomName from the data
    const { roomName } = data
    if (data !== undefined)
      // emit the chat message to the users inside the given roomName
      io.to(roomName.join('-')).emit('chatMessage', data)
  }

const handleDisconnect = (socket: typeof Socket) => (email: string) => {
  // Get the index of
  console.log('DISCONNECT HIT')
  const userIndex = onlineUsers.findIndex((user) => user.email === email)
  console.log(userIndex)
  if (userIndex !== -1) {
    const disconnectedUser = onlineUsers[userIndex]
    onlineUsers.splice(userIndex, 1)

    socket.broadcast.emit('userOffline', disconnectedUser.email)
  }
}
