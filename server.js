const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.IO
  const io = new Server(httpServer, {
    path: '/api/socket',
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || '*',
      methods: ['GET', 'POST'],
    },
  });

  // Socket.IO authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || 
                  socket.handshake.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      // Import verifyToken dynamically
      const { verifyToken } = require('./lib/auth');
      const decoded = verifyToken(token);
      
      if (!decoded) {
        return next(new Error('Invalid token'));
      }

      socket.data.user = decoded;
      next();
    } catch (error) {
      return next(new Error('Authentication error'));
    }
  });

  // Socket.IO connection handler
  io.on('connection', (socket) => {
    const user = socket.data.user;
    console.log(`User connected: ${user.email} (${user.role})`);

    // Join user-specific room
    socket.join(`user:${user.userId}`);
    
    // Join role-specific room
    socket.join(`role:${user.role}`);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${user.email}`);
    });
  });

  // Store io instance globally for use in API routes
  global.io = io;

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.IO ready on ws://${hostname}:${port}/api/socket`);
    });
});

