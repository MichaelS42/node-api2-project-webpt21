const express = require("express");
const router = express.Router();
router.use(express.json());
const Posts = require("../data/db.js");
const Comments = require("../data/db.js");

router.get("/", (req, res) => {
  Posts.find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Post info couldn't be retrieved",
      });
    });
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(500).json.apply({
          error: "error",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "post with specified ID doesn't exist",
      });
    });
});

router.get("/:id/comments", (req, res) => {
  Posts.findCommentById(req.params.id)
    .then((comments) => {
      if (comments) {
        res.status(200).json(comments);
      } else {
        res.status(404).json({
          message: "The specified ID doens't exist",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Comment inof couldn't be retrieved",
      });
    });
});

router.post("/", (req, res) => {
  Posts.insert(req.body)
    .then((post) => {
      if (!req.body.title || !req.body.contents) {
        res.status(400).json({ error: "post needs title and content" });
      } else {
        res.status(201).json(post);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "error occured in saving the comment",
      });
    });
});

router.post("/:id/comments", (req, res) => {
  const comment = req.body;
  Posts.insertComment(req.body);
  if (!comment.text) {
    res.status(400).json({ erroMessage: "please provide text for comment" });
  } else if (!comment) {
    res.status(500).json({ error: "error" });
  }
});

router.delete("/:id", (req, res) => {
  Posts.remove(req.params.id)
    .then((removed) => {
      if (removed === 0) {
        res.status(404).json({
          message: "The post ID does not exist.",
        });
      } else {
        res.status(200).json(removed);
      }
    })
    .catch((error) => {
      res.status(500).json("Error on server side.");
    });
});

router.put("/:id", (req, res) => {
  const update = req.body;
  Posts.findById(req.params.id)
    .then(() => {
      if (!update.title || !update.contents) {
        res.status(400).json({
          errorMessage: "need title and contents",
        });
      } else {
        Posts.update(req.params.id, update)
          .then(() => {
            res.status(200).json(update);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "server error" });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ message: "post doesn't exist; provide new id" });
    });
});

module.exports = router;
