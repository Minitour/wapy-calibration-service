const util = require('util');
const bleno = require('bleno');
const InfoCharacteristic = require('./characteristics/info');
const WifiCharacteristic = require('./characteristics/wifi')

const BlenoPrimaryService = bleno.PrimaryService;

function PrimaryService() {
    PrimaryService.super_.call(this, {
        uuid: process.env['_SERVICE_ID'],
        characteristics: [
            new InfoCharacteristic(),
            new WifiCharacteristic()
        ]
    });
}
  
util.inherits(PrimaryService, BlenoPrimaryService);

module.exports = PrimaryService;