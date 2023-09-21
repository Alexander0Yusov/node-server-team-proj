const logger = require('morgan');
// const useSocket = require('socket.io');
const express = require('express');
const app = express();
const cors = require('cors');
// const server = require('http').Server(app);
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const authRouter = require('./routes/api/auth');
const eatenProductRouter = require('./routes/api/eatenProducts');
const diariesRouter = require('./routes/api/diaries');
const productsRouter = require('./routes/api/products');

const messageRouter = require('./routes/api/message');
const doneExercisesRouter = require('./routes/api/doneExercises');

// const { addUser, findUser, getRoomsUsers, removeUser } = require('./users');

// const io = useSocket(server, {
//   cors: {
//     origin: '*',
//   },
// });

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/users', authRouter);
app.use('/api/eaten-products', eatenProductRouter);
app.use('/api/done-exercises', doneExercisesRouter);
app.use('/api/diaries', diariesRouter);
app.use('/api/products', productsRouter);

app.use('/api/messages', messageRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

// io.on('connection', socket => {
//   socket.on('join', ({ name, room, avatar }) => {
//     socket.join(room);

//     const { user } = addUser({ name, room, avatar });

//     io.to(user.room).emit('room', {
//       data: {
//         room: user.room,
//         users: getRoomsUsers(user.room),
//       },
//     });
//   });

//   socket.on('send', ({ message, params }) => {
//     const user = findUser(params);

//     if (user) {
//       io.to(user.room).emit('message', {
//         data: { user, message },
//       });
//     }
//   });

//   socket.on('leftRoom', ({ params }) => {
//     const user = removeUser(params);

//     if (user) {
//       io.to(user.room).emit('room', {
//         data: {
//           room: user.room,
//           users: getRoomsUsers(user.room),
//         },
//       });
//     }
//   });

//   socket.on('disconnect', () => console.log('Disconnect'));
// });

// module.exports = server;
module.exports = app;
