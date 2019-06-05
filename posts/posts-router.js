const express = require('express');
const db = require('../data/db.js');
const router = express.Router();


router.get('/', (req, res) => {
  
  db.find()
    .then( posts => {
      res.status(200).json({ posts });
    })
    .catch( err => {
      res.status(500).json({ error: "The posts information could not be retrieved." });
    })
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  db
    .findById(id)
    .then( post => {
      console.log(post);
      if(post.length === 0) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      } else {
      res.status(200).json({ post })
      }
    })
    .catch( err => {
      res.status(404).json({ error: "The post information could not be retrieved." })
    })
})

router.post('/', (req, res) => {
  const newPost = req.body;
  console.log(newPost);
  if(!newPost.title || !newPost.contents) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  }

  db
    .insert(newPost)
    .then( post => {
      res.status(201).json( {post} );
    })
    .catch( err => {
      res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
})

router.put('/:id', (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const { id } = req.params;
  const changes = req.body;

  if(!changes.title || !changes.contents) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  }

  db
  .findById(id)
  .then( post => {
    if(post.length === 0) {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else {
      db
        .update(id, changes)
        .then( post => {
          res.status(200).json( post );
        })
        .catch( err => {
          res.status(500).json({ message: 'err' });
        }) 
    }
  })
  .catch( err => {
    res.status(500).json({ error: "The post information could not be modified." } )
  })
})

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db
    .findById(id)
    .then( post => {
      if(post.length === 0) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      } else {
        db
          .remove(id)
          .then( post => {
            res.status(204).end();
          })
          .catch( err => {
            res.status(500).json({ message: 'err' });
          }) 
      }
    })
    .catch( err => {
      res.status(500).json({ error: "The post could not be removed" } )
    })
})

router.get('/:id/comments', (req, res) => {
  const { id } = req.params;

  db
  .findById(id)
  .then( post => {
    if(post.length === 0) {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else {
      db
        .findPostComments(id)
        .then( comments => {
          res.status(200).json({ comments })
        })
        .catch( err => {
          res.status(500).json({ error: "The comments information could not be retrieved." })
        })
    }
  })
  .catch( err => {
    res.status(500).json({ error: "The comments information could not be retrieved." } )
  })
})

router.post('/:id/comments', (req, res) => {
  const { id } = req.params;
  const newComment = {...req.body, post_id: id};
  if(!newComment.text) {
    res.status(400).json({ errorMessage: "Please provide text for the comment." })
  }

  db
  .findById(id)
  .then( post => {
    if(post.length === 0) {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else {
      db
        .insertComment(newComment)
        .then( comment => {
          res.status(201).json({ comment })
        })
        .catch( err => {
          res.status(500).json({ error: "The comments information could not be retrieved." })
        })
    }
  })
  .catch( err => {
    res.status(500).json({ error: "The comments information could not be retrieved." } )
  })
})

module.exports = router;