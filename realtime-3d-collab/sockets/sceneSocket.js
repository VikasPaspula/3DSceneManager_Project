const Scene = require('../models/Scene');

const sceneSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('New socket connected');

    socket.on('joinScene', ({ sceneId, userId }) => {
      socket.join(sceneId);
      console.log(`User ${userId} joined scene ${sceneId}`);
    });

    socket.on('updateScene', async ({ sceneId, objects }) => {
      await Scene.findByIdAndUpdate(sceneId, { objects });
      socket.to(sceneId).emit('sceneUpdated', objects);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  });
};

module.exports = sceneSocket;