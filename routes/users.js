var express = require('express');
var router = express.Router();
const raspi = require('raspi');
// const gpio = require('raspi-gpio');
const Serial = require('raspi-serial').Serial;


var serialOptions = {
    portId : '/dev/ttyUSB0',
    baudRate:9600,
    dataBits:8,
    stopBits:1,
    // parity:PARITY_NONE

  }
  
/* GET users listing. */
router.get('/', function(req, res, next) {
  raspi.init(() => {
  var serial = new Serial(serialOptions);
  console.log("seral new")
  serial.open(() => {
    serial.write('Hello from raspi-serial');
    console.log('send messages')
    serial.on('data', (data) => {
      process.stdout.write(data);
    });
  });
});
  res.send('respond with a resource');
});

module.exports = router;
