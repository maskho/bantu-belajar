const express = require('express');
const router = express.Router();

const Post = require('../../models/Get');
const User = require('../../models/Users');
const Post = require('../../models/Product');

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  //Return the first 5 penggalang:
  dbo.collection("penggalang").find().limit(5).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
      const posts = await Post.find().sort({ date: -1 });
      res.json(posts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  // @route    GET api/posts/:id
  // @desc     Get post by ID
  // @access   Private
  router.get('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      res.json(post);
    } catch (err) {
      console.error(err.message);
  
      res.status(500).send('Server Error');
    }
  });

  module.exports = router;