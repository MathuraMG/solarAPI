const express = require('express'); // Web Framework
const app = express();
const mysql = require('mysql');
var cors = require('cors');
app.use(cors());

const connection = mysql.createConnection({
  host: process.env.ITPOWER_HOST,
  user: process.env.ITPOWER_USER,
  password: process.env.ITPOWER_PASSWORD,
  database: process.env.ITPOWER_DB
});

var server = app.listen(process.env.PORT || 8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("app listening at http://%s:%s", host, port)
});


app.get("/data", function (req, res) {
  let startTime, endTime, query;
  connection.connect((err) => {
    if(req.query.startTime && req.query.endTime){
      startTime = req.query.startTime;
      endTime = req.query.endTime;
      query = 'select * from itpower.BatteryValues where RecordTime > ' + startTime + 'and RecordTime < ' + endTime + ';';
    } else if(req.query.startTime){
      startTime = req.query.startTime;
      query = 'select * from itpower.BatteryValues where RecordTime > ' + startTime + ';';
    } else {
      query = 'select * from itpower.BatteryValues order by RecordTime desc limit 100';
    }
    console.log(query);
    connection.query(query, function(error, results, fields){
      res.end(JSON.stringify(results)); // Result in JSON format
    });
  });
})
