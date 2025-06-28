// Handles all game-related socket logic for multiplayer game events
import { Server, Socket } from 'socket.io'

enum gameEvents {
    START_GAME = 'startGame',
    JOIN_GAME = 'joinGame',
    MAP_CORDS = 'mapCords',
    CURRENT_PLAYERS = 'currentPlayers',
    MAP_CREATED = 'mapCreated',
    PLAYER_DISCONNECTED = 'playerDisconnected',
    Error = 'error'
}

enum playerEvents {
    NEW_PLAYER = 'newPlayer',
    YOUR_PLAYER_NUMBER = 'yourPlayerNumber',
    PLACE_BOMB = 'placeBomb',
    BOMB_PLACED = 'bombPlaced',
    PLAYER_DIED = 'playerDied',
    MOVE = 'move',
    PLAYER_MOVED = 'playerMoved',
    DISCONNECT = 'disconnect',
}

interface Player {
  id: string
  x: number
  y: number
}

let players: Record<string, Player> = {}
let mapCords: { x: number; y: number }[] = []

export function registerGameSocketHandlers(socket: Socket, io: Server) {
  socket.on(gameEvents.JOIN_GAME, () => {
    players[socket.id] = { id: socket.id, x: 200, y: 200 }
    socket.broadcast.emit(playerEvents.NEW_PLAYER, players[socket.id])
    socket.emit(playerEvents.YOUR_PLAYER_NUMBER, Object.keys(players).length)
    socket.emit(gameEvents.MAP_CORDS, mapCords)
    socket.emit(gameEvents.START_GAME)
  })

  socket.emit(gameEvents.CURRENT_PLAYERS, players)

  socket.on(playerEvents.MOVE, (data: { x: number; y: number }) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x
      players[socket.id].y = data.y
      socket.broadcast.emit(playerEvents.PLAYER_MOVED, {
        id: socket.id,
        x: data.x,
        y: data.y,
      })
    }
  })

  socket.on(gameEvents.MAP_CREATED, (data: any) => {
    mapCords = data
  })

  socket.on(playerEvents.PLACE_BOMB, (data: { x: number; y: number }) => {
    socket.broadcast.emit(playerEvents.BOMB_PLACED, data)
    socket.emit(playerEvents.BOMB_PLACED, data)
  })

  socket.on(playerEvents.PLAYER_DIED, (data: { id: string }) => {
    if (players[data.id] != undefined) {
      socket.broadcast.emit(playerEvents.PLAYER_DIED, data)
      socket.emit(playerEvents.PLAYER_DIED, data)
    }
  })

  socket.on(playerEvents.DISCONNECT, () => {
    delete players[socket.id]
    socket.broadcast.emit(gameEvents.PLAYER_DISCONNECTED, socket.id)
  })

  socket.on(gameEvents.Error, (err: any) => {
    console.log('error happened', err)
  })
}

// Optionally, add helpers to reset or get state for testing
export function resetGameState() {
  players = {}
  mapCords = []
}