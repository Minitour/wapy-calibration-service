const bleno = require('bleno-mac');
const util = require('util');

const Descriptor = bleno.Descriptor;
const Characteristic = bleno.Characteristic;

class InfoCharacteristic {
    constructor() {
        InfoCharacteristic.super_.call(this, {
            uuid: 'ec0e',
            properties: ['read']
        });
    }
    onReadRequest(offset, callback) {

        // The payload to send. This data should be read from a singleton.
        const data = {
            'version' : '1.0.0',
            'name' : 'The Box',
            'paired' : false,
            'step' : 0
        }

        const res = JSON.stringify(data)
        console.log(res)
        callback(this.RESULT_SUCCESS, new Buffer([1]));
    }
}

util.inherits(InfoCharacteristic, Characteristic);

  

module.exports = InfoCharacteristic;
