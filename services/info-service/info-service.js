const util = require('util');
const bleno = require('bleno');
const InfoCharacteristic = require('./info-characteristic');

const BlenoPrimaryService = bleno.PrimaryService;

function InfoService() {
    InfoService.super_.call(this, {
        uuid: 'ec00',
        characteristics: [
            new InfoCharacteristic()
        ]
    });
}
  
util.inherits(InfoService, BlenoPrimaryService);

module.exports = InfoService;