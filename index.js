var SerialPort = require('serialport').SerialPort;
var serialPort = new SerialPort('/dev/ttyAMA0', {
  baudrate: 115200
});
var express = require('express');
var bodyParser = require('body-parser')
var _gcodes = [];
serialPort.on('open', function () {
  console.log('serial opened!');
  serialPort.on('data', function (data) {
    if(data.toString().toLowerCase().indexOf('ok')>-1){
      sendNext();
    }
  });
});
serialPort.on('close', function () {
  console.log('close');
})
function sendNext(){
  if(_gcodes.length>0){
    serialPort.write( _gcodes.shift()+"\n");
  }
}
var app = express();
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/gcode', (req, res) => {
    _gcodes = _gcodes.concat(req.body.data.split('\n'));
    sendNext();
    res.send('ok');
})
app.get('/move', (req, res) => {
    serialPort.write("G91\n");
    serialPort.write("G1 X"+req.query.x+" Y"+req.query.y+"\n");
    res.send('ok');
})
app.get('/laser', (req, res) => {
    serialPort.write("M3 P"+(req.query.status?5:0)+"\n");
    res.send('ok');
})
app.get('/setzero', (req, res) => {
    serialPort.write("G92 X0 Y0 Z0\n");
    res.send('ok');
})

app.listen(8000);
console.log("127.0.0.1:8000");
