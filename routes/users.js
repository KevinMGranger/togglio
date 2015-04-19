var bcrypt = require('bcrypt');
var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  var hash = bcrypt.hashSync(req.body.password, 10);

  req.db.query(
    'INSERT INTO users SET ?',
    {
      username: req.body.username,
      hash: hash
    },
    function(err, result) {
      if (err) {
        res.json({
          error: err
        });
      } else {
        res.json({ success: true, id: result.insertId });
      }
    }
  );
});

router.post('/login', function(req, res, next) {
  req.db.query(
    'SELECT * FROM users WHERE username = ?',
    [req.body.username],
    function(err, results) {
      if (err) {
        res.json({
          error: err
        });
      } else {
        if (results.length === 0) {
          res.json({
            error: "Invalid username and/or password."
          });
        }

        var result = results[0];
        var storedHash = result.hash;

        res.json({
          success: bcrypt.compareSync(req.body.password, storedHash)
        });
      }
    }
  );
});

router.get('/:user/resources', function(req, res, next) {
  req.db.query(
    'SELECT resourceName, statusID FROM resources WHERE userID = ?',
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

router.get('/:user/:resource', function(req, res, next) {
  req.db.query(
    'SELECT * FROM resources WHERE resourceName = ?',
    req.params.resource,
    function(err, rows, fields) {
      if (err) {
        next(new Error("No such resource."));
      } else {
        res.json(rows);
      }
    });
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
