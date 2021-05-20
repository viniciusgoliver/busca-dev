import socketio from 'socket.io-client';

//const backEnd = 'http://192.168.5.59:3333';  
const backEnd = 'http://10.1.50.61:3333';    

const socket = socketio(backEnd, {
  autoConnect: false,
});

function subscribeToNewDevs(subcribeFunction) {
  socket.on('new-dev', subcribeFunction);
}

function connect(latitude, longitude, techs) {
  socket.io.opts.query = {
    latitude,
    longitude,
    techs,
  };

  socket.connect();
}

function disconnect() {
  if (socket.connected) {
    socket.disconnect();
  }
}

export {
  connect,
  disconnect,
  subscribeToNewDevs
};
