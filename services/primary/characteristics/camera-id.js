// write only

const bleno = require('bleno');
const util = require('util');
const sharedInstance = require('../../shared-instance');
const notifyService = require('../../service-notifier');
const firebase = require("firebase");
require("firebase/functions");
const functions = firebase.functions();
const getCamera = firebase.functions().httpsCallable('getCamera');

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
        try {
            const data = await getCamera({ cameraId: sharedInstance.camera_id });
            console.log(data);
            sharedInstance.cloudObject = data;
            await notifyService();

        }catch (e) {
            console.log(e);
        }

        callback(this.RESULT_SUCCESS);
    }
}

util.inherits(CameraIDCharacteristic, Characteristic);
module.exports = CameraIDCharacteristic;