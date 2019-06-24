var mysql = require('mysql')
var con   = mysql.createConnection({
    host        : 'localhost',
    user        : 'root',
    password    : 'root',
    database    : 'MTEC_TEST',
    port        : '3306'
})

con.connect(function(err) {
    if(err) throw err
    console.log("Server was connected!")
})

module.exports = con