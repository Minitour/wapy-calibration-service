const util = require('util');
const bleno = require('bleno');
const InfoCharacteristic = require('./characteristics/info');
const WifiCharacteristic = require('./characteristics/wifi');
const ReadOffsetCharacteristic = require('./characteristics/read-offset');
const WriteOffsetCharacteristic = require('./characteristics/write-offset');
const TokenCharacteristic = require('./characteristics/token');
const SSIDCharacteristic = require('./characteristics/bssid');
const sharedInstance = require('../shared-instance');
const BlenoPrimaryService = bleno.PrimaryService;

function PrimaryService() {
    PrimaryService.super_.call(this, {
        uuid: process.env['_SERVICE_ID'],
        characteristics: [
            new InfoCharacteristic(),
            new WifiCharacteristic(),
            new ReadOffsetCharacteristic(),
            new WriteOffsetCharacteristic(),
            new TokenCharacteristic(),
            new SSIDCharacteristic()
        ]
    });
}
  
util.inherits(PrimaryService, BlenoPrimaryService);

module.exports = PrimaryService;