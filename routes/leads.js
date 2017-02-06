var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('leads/index', { title: 'List of the leads that you have' });
});

module.exports = router;
