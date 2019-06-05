const express = require('express');
const postsRouter = require('./posts/posts-router.js');

const server = express();

server.use(express.json()); // add this to make post and put work

server.use('/api/posts', postsRouter);

//
module.exports = server;