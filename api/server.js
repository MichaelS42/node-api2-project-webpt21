const express = require("express");
const postsRouter = require("./posts-router.js");
const server = express();

server.use(express.json());

server.use("/api/posts", postsRouter);

server.use("/", (req, res) => {
  res.send(`
    <h1> Server is up</h1> 
    `);
});

module.exports = server;
