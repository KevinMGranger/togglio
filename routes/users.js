var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  console.log(req.body);
  res.json({ success: true });
});

router.get('/:user/resources', function(req, res, next) {
  req.db.query(
    'SELECT resourceName, statusID FROM resources WHERE userId = ?',
    [req.params.user],
    function(err, rows, fields) {
      res.json(rows);
    }
  );
});

router.post('/:user/resources', function(req, res, next) {
  var record = {
    userID: req.params.user,
    resourceName: req.body.resource,
    statusID: 0
  };

  req.db.query(
    'INSERT INTO resources SET ?',
    record,
    function(err, rows, fields) {
      if (err) {
        next(new Error("Failed to create resource."));
      } else {
        res.json({ success: true });
      }
    }
  );
});

router.post('/:user/:resource/toggle', function(req, res, next) {
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
