const { app } = require('./src/app');
const { connectToDatabase } = require('./src/database/connection');
const { socketAuth } = require('./src/middlewares/protect');
require('dotenv').config();

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 7001;

// Connect to database
connectToDatabase();

const server = app.listen(PORT, async () => {
  console.log('Server is running on port ' + PORT);
});

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PURGE'],
  },
});

io.use(socketAuth);

io.on('connection', async (socket) => {
  console.log('🔥 User connected:', socket.user.uid);
  socket.io = io;

  app.set('socket', socket);

  socket.on('disconnect', async () => {
    console.log('🧯 User disconnected: ', socket.user.uid);
  });
});
