var express = require("express");
var router = express.Router();
var doQuery = require('../utils/doQuery')

router
        .route("/users") //ติดต่อฐานข้อมูลทั้งหมดเลย
            .get((req, res) => {
                var sql = "SELECT * FROM User" //ดึงค่ามา จาก database 
                doQuery(sql).then((resp) => {
                    res.json(resp)
                })
                .catch(err => [
                    res.json({
                        msg: err
                    })
                ])
            })

        .post((req, res) => {
            var body = req.body
            var sql = `INSERT INTO User(firstname, lastname, username, password, email) 
            VALUES('${body.firstname}', '${body.lastname}', '${body.username}', '${body.password}','${body.email}')`;
            doQuery(sql).then(resp => {
                res.json({
                    message: 'success',
                    data: resp
                })
                // res.redirect('/')   
            }).catch(err => {
                res.json({
                    message: err
                })
            })

        })

  router .route('/login')
        .post((req, res) => { //ต่อเนื่องมาจากหน้้า
            var body = req.body
            const sql = `SELECT username,password FROM User WHERE username='${body.username}' AND password='${body.password}'`  //ดึงข้อมูล จากทั้ง user . password
            doQuery(sql).then(resp => {
                res.json({
                    message: 'ok',
                    data: resp
                })
                console.log(res.json(message))
            }) 
        })
module.exports = router;