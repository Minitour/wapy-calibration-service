//read only
const bleno = require('bleno');
const util = require('util');
const sharedInstance = require('../../shared-instance');

const Characteristic = bleno.Characteristic;

class InfoCharacteristic {
    constructor() {
        InfoCharacteristic.super_.call(this, {
            uuid: process.env['_CHAR_INFO_ID'],
            properties: ['read']
        });
    }
    onReadRequest(offset, callback) {
        // TODO: create data object from real data.
        // The payload to send. This data should be read from a singleton.
        const data = {
            'version' : '1.0.0',
            'name' : 'The Box',
            'paired' : false,
            'step' : 0
        }

        const res = JSON.stringify(data);
        var val = Buffer.from(res);
        var range = offset + sharedInstance.offset.read;
        
        if (range > val.length) {
          console.log("OUT OF BOUNDS")
          callback(this.RESULT_INVALID_OFFSET, 0);
          return
        }

        val = val.slice(range);
        console.log(val.toString('utf-8'))
        console.log(offset + sharedInstance.offset.read);
        callback(this.RESULT_SUCCESS, val);
    }
}

util.inherits(InfoCharacteristic, Characteristic);

  

module.exports = InfoCharacteristic;
