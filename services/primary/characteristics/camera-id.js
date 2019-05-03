// write only

const bleno = require('bleno');
const util = require('util');
const sharedInstance = require('../../shared-instance');

const Characteristic = bleno.Characteristic;

class CameraIDCharacteristic {
    constructor() {
        CameraIDCharacteristic.super_.call(this, {
            uuid: process.env['_CHAR_CAMERA_ID'],
            properties: ['write']
        });
    }
    onWriteRequest(data, offset, withoutResponse, callback) {
        const res = JSON.parse(data.toString());

        sharedInstance.camera_id = res.camera_id; 

        callback(this.RESULT_SUCCESS);
    }
}

util.inherits(CameraIDCharacteristic, Characteristic);
module.exports = CameraIDCharacteristic;