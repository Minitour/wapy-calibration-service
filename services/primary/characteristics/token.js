// write only
const bleno = require('bleno');
const util = require('util');
const sharedInstance = require('../../shared-instance');

const Characteristic = bleno.Characteristic;

class TokenCharacteristic {
    constructor() {
        TokenCharacteristic.super_.call(this, {
            uuid: process.env['_CHAR_TOKEN_ID'],
            properties: ['write']
        });
    }
    onWriteRequest(data, offset, withoutResponse, callback) {
        console.log(offset)
        const res = JSON.parse(data.toString());
        console.log(res)
        sharedInstance.token = res.token;
        callback(this.RESULT_SUCCESS);
    }
}

util.inherits(TokenCharacteristic, Characteristic);
module.exports = TokenCharacteristic;
