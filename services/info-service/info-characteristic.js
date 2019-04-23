const bleno = require('bleno');
const util = require('util');

const Descriptor = bleno.Descriptor;
const Characteristic = bleno.Characteristic;

function makeid(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

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
            'step' : 0,
            'random_id' : makeid(300)
        }
        const res = JSON.stringify(data)
        callback(this.RESULT_SUCCESS, Buffer.from(res));
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
