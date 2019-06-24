var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var morgan = require('morgan')
var methodOverride = require('method-override')
const axios = require('axios')

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(morgan('dev'))
  app.use(methodOverride())

  app.set('view engine', 'ejs')

  app.get('/', (req, res) => { //เมื่อ เข้ามาที่ / จะเด้งไปยัง หน้า Login
    res.render('Login')
  })
  //เด้งไปยัง user.js
  app.post('/login', (req,res)  =>{
      //หากต้องการเพิ่มข้อมูล
  })

  app.get('/register', (req, res) => {  //แสดงหน้า เฉยๆ ไอเวรเอ้ย
    res.render('Registor') //จะไปเรียกแสดงหน้าต่าง ไฟล์ชื่อ Registor.ejs
  })

  app.post('/register', (req, res) => { // เงื่อ นไขการสมัคร
    var body = req.body; //ดัีงข้อมูล จาก การสมัครทั้งหมด ไว้ๆ

    console.log(body)
    const insertData = axios.post('http://localhost:8000/api/Users', body)
    console.log(insertData)
    // alert(insertData);
    if(insertData){
      res.redirect('/')
    }else{
      console.log("ERR");
    }
    // alert(insertData);
  })

  app.get('/showdata', (req,res) =>{
    res.render('showdata');
  })

  

  app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
      res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept")
      res.header('Access-Control-Allow-Credentials', true)
      next()
    })
    
    console.log("app ok ")
  module.exports = app