const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// In-memory store for posts, users, and messages
let posts = [];
let users = {}; // Maps socket IDs to usernames
let messages = []; // Stores all chat messages

// Create an HTTP server
const server = http.createServer(app);

// Create a WebSocket server using the HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  // Register a new user
  socket.on('register', (username) => {
    users[socket.id] = username;
    console.log(`User registered: ${username} with socket ID: ${socket.id}`);

    // Send previous messages to this user
    socket.emit('previousMessages', messages.filter(msg => msg.recipient === username || msg.sender === username));
  });

  // Handle sending messages
  socket.on('sendMessage', (msg) => {
    console.log('Sending message:', msg); // Debug log

    // Find the recipient's socket ID
    const recipientSocketId = Object.keys(users).find(id => users[id] === msg.recipient);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('newMessage', msg); // Send to recipient
    }
    io.to(socket.id).emit('newMessage', msg); // Send to sender

    messages.push(msg);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
    delete users[socket.id];
  });
});

// Registration endpoint
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log({ username, email, hashedPassword });

    // Here you should save the user data to a database
    // e.g., await UserModel.create({ username, email, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Like post endpoint
app.post('/like', (req, res) => {
  const { postId, username } = req.body;

  let post = posts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (post.likedBy.includes(username)) {
    return res.status(400).json({ message: 'User has already liked this post' });
  }

  post.likesCount += 1;
  post.likedBy.push(username);

  res.status(200).json({ message: 'Post liked successfully', post });
});

// Unlike post endpoint
app.post('/unlike', (req, res) => {
  const { postId, username } = req.body;

  let post = posts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (!post.likedBy.includes(username)) {
    return res.status(400).json({ message: 'User has not liked this post' });
  }

  post.likesCount -= 1;
  post.likedBy = post.likedBy.filter(user => user !== username);

  res.status(200).json({ message: 'Post unliked successfully', post });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
