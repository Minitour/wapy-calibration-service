// write only

const bleno = require('bleno');
const util = require('util');
const sharedInstance = require('../../shared-instance');
const notifyService = require('../../service-notifier');
const App = require('../../firebase-application');
require("firebase/functions");
const functions = App.functions();
const ChangeObserver = require('../../change-observer');
const getCamera = functions.httpsCallable('getCamera');

const Characteristic = bleno.Characteristic;

class CameraIDCharacteristic {
    constructor() {
        CameraIDCharacteristic.super_.call(this, {
            uuid: process.env['_CHAR_CAMERA_ID'],
            properties: ['write']
        });
    }
    async onWriteRequest(data, offset, withoutResponse, callback) {
        const res = JSON.parse(data.toString());

        if (sharedInstance.isCalibrated()){
            console.log("Camera already set, use Request Update");
            callback(this.RESULT_UNLIKELY_ERROR);
            return;
        }

        sharedInstance.camera_id = res.camera_id;
        try {
            const result = await getCamera({ cameraId: sharedInstance.camera_id });
            console.log(JSON.stringify(data));
            sharedInstance.cloudObject = result.data.data;
            await notifyService();
            ChangeObserver.start(sharedInstance.cloudObject.id);

        } catch (e) {
            console.log(e);
        }

        callback(this.RESULT_SUCCESS);
    }
}

util.inherits(CameraIDCharacteristic, Characteristic);
module.exports = CameraIDCharacteristic;