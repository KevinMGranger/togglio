var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  res.json({ success: true });
});

router.get('/:user', function(req, res, next) {
  res.json(req.params.user);
});

router.post('/:user/:resource/toggle?', function(req, res, next) {
  console.log('post resource/toggle');
});

router.post('/:user/:resource/on', function(req, res, next) {
  console.log('on');
});

router.post('/:user/:resource/off', function(req, res, next) {
  console.log('off');
});

router.get('/:user/:resource/hooks', function(req, res, next) {
  req.db.query(
    'SELECT * FROM ',
    function(err, rows, fields) {
      res.json(rows);
    }
  );
});

router.post('/:user/:resource/hooks', function(req, res, next) {

});

module.exports = router;
