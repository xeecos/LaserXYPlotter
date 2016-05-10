var Serial = require('serialport');
var SerialPort = Serial.SerialPort;
var serialPort;
var express = require('express');
var bodyParser = require('body-parser')
var _gcodes = [];
var _buffers = "";

function sendNext(){
  if(_gcodes.length>0){
    serialPort.write( _gcodes.shift()+"\n");
  }
}
var app = express();
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json({limit: '256mb'}));
app.use(bodyParser.urlencoded({ limit:'256mb',extended: true }));

app.post('/gcode', (req, res) => {
    _gcodes = _gcodes.concat(req.body.data.split('\n'));
    sendNext();
    res.send('ok');
})
app.post('/connect',(req,res) => {
    serialPort = new SerialPort(req.body.data, {baudrate: 115200});
    serialPort.on('open', function () {
      console.log('serial opened!');
      serialPort.on('data', function (data) {
        _buffers += data.toString().toLowerCase();
        if(_buffers.indexOf('ok')>-1){
            _buffers = "";
          sendNext();
        }
      });
    });
    serialPort.on('close', function () {
      console.log('close');
    })
    res.send('ok');
});
app.post('/list',(req,res) => {
 Serial.list(function (err, ports) {
    var result = "";
    ports.forEach(function(port) {
       result+=port.comName+",";
    });
    res.send(result.substr(0,result.length-1));
});   
});
app.post('/disconnect',(req,res) => {
    if(serialPort){
        serialPort.close();
    }
    serialPort = null;
    res.send("ok");
});
app.get('/move', (req, res) => {
    serialPort.write("G91\n");
    serialPort.write("G1 X"+req.query.x+" Y"+req.query.y+" F"+req.query.seekrate+"\n");
    res.send('ok');
})
app.get('/rect', (req, res) => {
    serialPort.write("G90\n");
    serialPort.write("G1 X"+req.query.x+" Y"+req.query.y+" F"+req.query.seekrate+"\n");
    res.send('ok');
})
app.get('/laser', (req, res) => {
    serialPort.write("M3 P"+(req.query.status*1==1?3:0)+"\n");
    res.send('ok');
})
app.get('/setzero', (req, res) => {
    serialPort.write("G92 X0 Y0 Z0\n");
    res.send('ok');
})

app.listen(8000);
console.log("127.0.0.1:8000");
