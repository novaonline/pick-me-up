var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var hostLocationDictionary = {
  // 'test': {
  //     lat: 50.49045799,
  //     lng: -104.58874179,
  // }
  // 'test': {
  //   lat: 52.06823061,
  //   lng: -106.57960521,
  // }
}

//app.use('/', express.static(path.join(__dirname, 'socket-test/dist')))

io.on('connection', function (socket) {
  var room = socket.handshake.query.room;
  if (socket.rooms[room] || hostLocationDictionary[room]) {
    // visitor
    socket.join(room);
    socket.emit('clientType', 'VISITOR');
    getHostLocationDictionary(room).visitor = socket.id;
    getHostLocationDictionary(room).room = room;
    io.to(room).emit('getLocation', getHostLocationDictionary(room).coords);
  } else {
    socket.join(room);
    // host... we'd like their location
    getHostLocationDictionary(room).host = socket.id;
    getHostLocationDictionary(room).room = room;
    socket.emit('clientType', 'HOST');
  }
  console.log('a user connected');
  console.log('host', getHostLocationDictionary(room).host);
  console.log('visitor', getHostLocationDictionary(room).visitor);


  socket.on('sendLocation', (room, coords) => {
    console.log('got something from sender');
    getHostLocationDictionary(room).coords = coords;
    io.to(room).emit('getLocation', getHostLocationDictionary(room).coords);
  })
  socket.on('sendDuration', (room, duration) => {
    console.log('got something receiver');
    getHostLocationDictionary(room).duration = duration;
    io.to(room).emit('getDuration', getHostLocationDictionary(room).duration);
  });

  socket.on('disconnect', (value) => {

    var hostRoom = Object.values(hostLocationDictionary).filter(x => x.host === socket.id);
    if (hostRoom && hostRoom.length > 0) {
      console.log('values', hostRoom);
      console.log("disconnection", socket.id, hostRoom[0].room);
      makeVisitorHost(hostRoom[0].room);
    }
  })
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});

function getHostLocationDictionary(room) {
  hostLocationDictionary[room] = hostLocationDictionary[room] || {};
  return hostLocationDictionary[room];
}

function makeVisitorHost(room) {
  const visitor = getHostLocationDictionary(room).visitor;
  getHostLocationDictionary(room).host = visitor;
  getHostLocationDictionary(room).visitor = null;
  console.log("current val:", getHostLocationDictionary(room));
  io.to(getHostLocationDictionary(room).host).emit('clientType', 'HOST');
}
