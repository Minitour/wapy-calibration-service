// write only
const bleno = require('bleno');
const util = require('util');
const sharedInstance = require('../../shared-instance');

const Characteristic = bleno.Characteristic;

class WriteOffsetCharacteristic {
    constructor() {
        WriteOffsetCharacteristic.super_.call(this, {
            uuid: process.env['_CHAR_WRITE_ID'],
            properties: ['write']
        });
    }
    onWriteRequest(data, offset, withoutResponse, callback) {
        const res = JSON.parse(data.toString());
        sharedInstance.offset.write = res.offset;
        callback(this.RESULT_SUCCESS);
      }
}

util.inherits(WriteOffsetCharacteristic, Characteristic);
module.exports = WriteOffsetCharacteristic;
