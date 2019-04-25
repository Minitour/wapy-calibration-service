// write only
const bleno = require('bleno');
const util = require('util');
const sharedInstance = require('../../shared-instance');

const Characteristic = bleno.Characteristic;

class ReadOffsetCharacteristic {
    constructor() {
        ReadOffsetCharacteristic.super_.call(this, {
            uuid: process.env['_CHAR_READ_ID'],
            properties: ['write']
        });
    }
    onWriteRequest(data, offset, withoutResponse, callback) {
        const res = JSON.parse(data.toString());
        sharedInstance.offset.read = res.offset;
        callback(this.RESULT_SUCCESS);
      }
}

util.inherits(ReadOffsetCharacteristic, Characteristic);
module.exports = ReadOffsetCharacteristic;