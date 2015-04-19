var bcrypt = require('bcrypt');
var express = require('express');
var router = express.Router();

var http = require('http');

function notifyAboutStateChange(url) {
  console.log("Getting " + url);
  http.get(url);
}

function runHooks(db, resource) {
  db.query(
      'SELECT url FROM hooks JOIN resources WHERE resourceName = ?',
      resource,
      function(err, results) {
        console.log("urls: ");
        console.log(results);
        for (var i in results) {
          var row = results[i];
          notifyAboutStateChange(row.url);
        }
      }
      );
}


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
    'SELECT resourceName, state FROM resources WHERE userID = ?',
    [req.params.user],
    function(err, rows, fields) {
      res.json(rows);
    }
  );
});

router.post('/:user/resources', function(req, res, next) {
  var record = {
    userID: req.params.user,
    resourceName: req.body.resource
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
  req.db.query(
    'SELECT * FROM resources WHERE resourceName = ?',
    req.params.resource,
    function(err, rows, fields) {
      if (err) {
        next(new Error("No such resource."));
      } else {
        req.db.query(
          'UPDATE resources SET state = ? WHERE resourceName = ?',
          [!rows[0].state, req.params.resource],
          function(err, rows, fields) {
            if (err) {
              next(new Error("No such resource."));
            } else {
              runHooks(req.db, req.params.resource);
              res.json({
                success: true
              });
            }
          }
        );
      }
    }
  );
});

router.post('/:user/:resource/on', function(req, res, next) {
  req.db.query(
    'UPDATE resources SET state = true WHERE resourceName = ?',
    req.params.resource,
    function(err, rows, fields) {
      if (err) {
        next(new Error("some error"));
      } else {
              runHooks(req.db, req.params.resource);
        res.json({
          success: true
        });
      }
    }
  );
});

router.post('/:user/:resource/off', function(req, res, next) {
  req.db.query(
    'UPDATE resources SET state = false WHERE resourceName = ?',
    req.params.resource,
    function(err, rows, fields) {
      if (err) {
        next(new Error("some error"));
      } else {
              runHooks(req.db, req.params.resource);
        res.json({
          success: true
        });
      }
    }
  );
});

router.get('/:user/:resource/hooks', function(req, res, next) {
  req.db.query(
    'SELECT * FROM hooks JOIN resources USING(resourceID) WHERE ?',
    {
	    userID: req.params.user,
	    resourceName: req.params.resource
    },
    function(err, rows, fields) {
      res.json(rows);
    }
  );
});

router.post('/:user/:resource/hooks', function(req, res, next) {

});

module.exports = router;
