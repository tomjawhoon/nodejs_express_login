var express = require("express");
var con = require("../config/route");
var router = express.Router();
var mongoObjectId = require("../utils/generateId");
var doQuery = require('../utils/doQuery')

router
  .route("/User")

  .get((req, res) => {
    var sql = "SELECT * FROM User";
    const query = req.query;
    const body = req.body
    if (!!query.id) {
      sql = `SELECT * FROM User WHERE user_id='${body.id}'`;
    }
    if (query.q) {
      sql = `SELECT * FROM User WHERE firstname REGEXP '${query.q}' OR lastname REGEXP '${query.q}' 
      OR username REGEXP '${query.q}' OR email REGEXP '${query.q}'`
    }
    doQuery(sql)
      .then((resp) => {
        res.json(resp)
      })
      .catch(err => {
        res.json({
          message: err
        });
      });
  })

router
  .route("/User/:id")

  .get((req, res) => {
    const params = req.params;
    var sql = `SELECT * FROM User WHERE user_id='${params.id}'`;
    doQuery(sql)
      .then(resp => res.json(resp))
      .catch(err => {
        res.json({
          message: err
        });
      });
  });

router
  .route('/User/pswd/:id')

  .get((req, res) => {
    const params = req.params
    var sql = ` SELECT AES_DECRYPT(password) FROM User WHERE user_id='${params.id}'`
    doQuery(sql).then((resp) => {
      res.json(resp)
    })
  })

router
  .route('/User/create')
  .post((req, res) => {
    const body = req.body;
    if (body.username || body.email) {
      let sql = `SELECT * FROM User WHERE username LIKE '${body.username}'OR email LIKE '${body.email}'`
      var filter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      doQuery(sql).then((resp) => {
        let mistake = [];
        let like = []
        let action = true
        if (resp.length > 0) {
          like.push({
            message: 'existed'
          })
          action = false
        }
        if (body.username.length < 5) {
          mistake.push({
            message: 'username must have 5 to 10 characters'
          })
          action = false
        } else if (body.username.length > 10) {
          mistake.push({
            message: 'username must have 5 to 10 characters'
          })
          action = false
        }
        if (!body.firstname) {
          mistake.push({
            message: "firstname require"
          });
        }
        if (body.password.length < 8) {
          mistake.push({
            message: 'Password must have 8 to 16 characters'
          })
          action = false
        } else if (body.password.length > 16) {
          mistake.push({
            message: 'Password must have 8 to 16 characters'
          })
          action = false
        }
        if (!body.password) {
          mistake.push({
            message: 'password require'
          })
        }
        if (!body.lastname) {
          mistake.push({
            message: "lastname require"
          });
        }

        if (!filter.test(body.email)) {
          mistake.push({
            message: 'email invalid format'
          })
        }
        ///
        if (like.length > 0) res.json(like)
        if (mistake.length > 0) res.json(mistake)
        return action
      }).then((resp) => {
        if (resp && body.firstname && body.lastname && body.username && body.password && filter.test(body.email)) {
          let sql = `INSERT INTO User(user_id, firstname, lastname, username, password, email)
                    VALUES ('${mongoObjectId()}', '${body.firstname}', '${
                    body.lastname}', '${body.username}', SHA1('${body.password}'), 
                    '${body.email}'`;
          doQuery(sql).then(resp => {
            res.json({
              message: 'added success',
              data: resp
            })
          }).catch(err => {
            res.json({
              message: err
            });
          });
        }

      })
    } else {
      res.json({
        message: "username or email is require"
      })
    }
  })

router
  .route('/User/update')

  .post((req, res) => {
    const body = req.body
    if (body.username) {
      let sql = `SELECT * FROM User WHERE username LIKE '${body.username}'`
      doQuery(sql).then((resp) => {
        var filter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        let action = true
        let mistake = []
        if (resp.length > 0) {
          mistake.push({
            message: 'username was existed'
          })
          action = false
        }
        if (!body.firstname && !body.password && !body.tel && !body.lastname) {
          mistake.push({
            message: 'Please, fill every information to update'
          })
          action = false
        }
        if (!filter.test(body.email)) {
          mistake.push({
            message: 'email invalid format'
          })
          action = false
        }
        if (mistake.length > 0) {
          res.json(mistake)
          console.log(mistake)
        }
        return action
      }).then((resp) => {
        var filter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (resp && body.firstname && body.password && body.tel && body.lastname && filter.test(body.email)) {
          let sql = `UPDATE User SET firstname='${body.firstname}', lastname='${
            body.lastname
          }', username='${body.username}', password='${body.password}', 
                        email='${body.email}', tel='${body.tel}', privilege='${
            body.privilege
          }' WHERE id='${body.id}'`;
          doQuery(sql)
            .then(resp => res.json({
              message: 'updated success'
            }))
            .catch(err => {
              res.json({
                message: err
              });
            });
        }
      })

    } else {
      res.json({
        message: 'username is require'
      })
    }

  })

router
  .route('/User/delete')
  
  .post((req, res) => {
    const body = req.body;
    if (body.id) {
      let sql = `DELETE FROM User WHERE id='${body.id}'`;
      doQuery(sql)
        .then((resp) => {
          res.json({
            message: 'delete success'
          })
        })
        .catch(err => {
          res.json({
            message: err
          });
        });
    } else {
      res.json({
        message: 'require id to delete'
      })
    }

  });


module.exports = router;