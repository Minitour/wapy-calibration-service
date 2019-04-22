const bleno = require('bleno');
const util = require('util');

const Descriptor = bleno.Descriptor;
const Characteristic = bleno.Characteristic;

class InfoCharacteristic {
    constructor() {
        InfoCharacteristic.super_.call(this, {
            uuid: 'ec0e',
            properties: ['read','write','notify']
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
        console.log(offset);
        const res = JSON.stringify(data)
        console.log(res)
        callback(this.RESULT_SUCCESS, new Buffer(res).slice(offset,offset + 22));
    }

    onWriteRequest(data, offset, withoutResponse, callback) {
        this._value = data;
      
        console.log('EchoCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));
      
        if (this._updateValueCallback) {
          console.log('EchoCharacteristic - onWriteRequest: notifying');
      
          this._updateValueCallback(this._value);
        }
      
        callback(this.RESULT_SUCCESS);
      }

      onSubscribe(maxValueSize, updateValueCallback) {
        console.log('EchoCharacteristic - onSubscribe');
      
        this._updateValueCallback = updateValueCallback;
      }
      
      onUnsubscribe() {
        console.log('EchoCharacteristic - onUnsubscribe');
      
        this._updateValueCallback = null;
      }
}

util.inherits(InfoCharacteristic, Characteristic);

  

module.exports = InfoCharacteristic;
