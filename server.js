var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var colors = require('colors');


/**
 * @type {Object.<string,RoomState>}
 * @const
 */
const serverState = {};


//app.use('/', express.static(path.join(__dirname, 'socket-test/dist')))

/* NOTE: keys are named in the client's perspective */
io.on('connection', (socket) => {
  var room = socket.handshake.query.room;
  handleConnection(socket, room);
  socket.on('send-new-user-toast', (room) => handleNewUser(socket, room));
  socket.on('send-host-location', (room, coords) => handleSendHostLocation(socket, room, coords));
  socket.on('send-duration-from-guest', (room, duration) => handleSendDurationFromGuest(socket, room, duration));
  socket.on('disconnect', () => handleDisconnection(socket));
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});


/* Helpers & Functions */

/**
 *
 * @param {SocketIO.Socket} socket
 * @param {string} room
 * @returns {boolean}
 */
let roomExists = (socket, room) => socket.rooms[room] || serverState[room];

/**
 * returns RoomState that the socket was hosting or nothing if they werent
 * @param {SocketIO.Socket} socket
 * @returns {RoomState | null}
 */
let asRoomHost = (socket) => Object.values(serverState).find(x => x.hostSocketId === socket.id);

/**
 * Determines if the socket should be a host or a guest
 * if a guest, the host location will be sent if available
 * @param {SocketIO.Socket} socket
 * @param {string} room
 */
let handleConnection = (socket, room) => {
  if (roomExists(socket, room) && serverState[room] && serverState[room].isFull()) {
    socket.emit('receive-client-type', 'OVERFLOW');
    console.log(`socket ${socket.id} exceeded room (${room}) capacity`.red);
  }
  else if (roomExists(socket, room)) {
    // join as guest
    socket.join(room);
    let roomState = serverState[room];
    roomState.guestSocketId = socket.id;
    socket.emit('receive-client-type', 'GUEST');
    if (roomState.hostLocation) {
      socket.emit('receive-host-location', roomState.hostLocation);
    }
    console.log(`a guest (${roomState.guestSocketId})
    entered room (${roomState.room})
    hosted by ${roomState.hostSocketId}`.green);
  } else { // join as host
    // create room and join room
    serverState[room] = new RoomState(room, socket.id);
    let roomState = serverState[room];
    socket.join(room);
    // when client is host ask for the client's location
    socket.emit('receive-client-type', 'HOST');
    console.log(`a host (${roomState.hostSocketId})
    entered room (${roomState.room})`.blue);
  }
}

/**
 * handles new users
 * @param {SocketIO.Socket} socket
 * @param {string} room
 */
let handleNewUser = (socket, room) => {
  socket.broadcast.to(room).emit('receive-new-user-toast');
}

/**
 * stores the host location and passes it to all other users in room (i.e. guest)
 * @param {SocketIO.Socket} socket
 * @param {string} room
 * @param {google.maps.LatLng} coords
 */
let handleSendHostLocation = (socket, room, coords) => {
  console.log(`host in room '${room}' sent coordinates`.gray);
  serverState[room].hostLocation = coords;
  socket.broadcast.to(room).emit('receive-host-location', serverState[room].hostLocation);
}

/**
 * passes the duration from the guest to all other users in room (i.e. host)
 * @param {SocketIO.Socket} socket
 * @param {string} room
 * @param {google.maps.Duration} duration
 */
let handleSendDurationFromGuest = (socket, room, duration) => {
  console.log(`guest in room '${room}' sent duration`.gray);
  socket.broadcast.to(room).emit('receive-duration-from-guest', duration);
}

/**
 * determine if the host or guest disconnected. If host, promote guest to host position
 * @param {SocketIO.Socket} socket
 */
let handleDisconnection = (socket) => {
  // disconnect the both of them
  // delete thisIsObject["Cow"];
  var hostedRoom = asRoomHost(socket);
  if (hostedRoom) {
    // the disconnected user was a host
    console.log(`disconnected user (${socket.id}) was a host for room '${hostedRoom.room}'`);
    delete serverState[hostedRoom.room];
    io.to(hostedRoom.room).emit('host-disconnected');
  } else {
    // guest client disconnected
    console.log(`disconnected user (${socket.id}) was a guest`);
  }
}

class RoomState {
  constructor(room, hostSocketId) {
    this.room = room;
    this.hostSocketId = hostSocketId;
    /* location is stored because the hosting client gets their initial location 'warmed up' for guest */
    this.hostLocation = null;
    this.guestSocketId = null;
  }

  isFull() {
    return this.hostSocketId && this.guestSocketId;
  }

  isEmpty() {
    return !this.hostSocketId && !this.guestSocketId;
  }
}
