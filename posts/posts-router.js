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
      res.status(200).json({ post })
    })
    .catch( err => {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    })
})



module.exports = router;