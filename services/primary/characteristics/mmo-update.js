//read only
const bleno = require('bleno');
const util = require('util');
const notifyService = require('../../service-notifier');
const sharedInstance = require('../../shared-instance');
const Characteristic = bleno.Characteristic;
const firebase = require("firebase");
require("firebase/functions");
const functions = firebase.functions();
const getCamera = firebase.functions().httpsCallable('getCamera');

class MMOUpdateCharacteristic {
    constructor() {
        MMOUpdateCharacteristic.super_.call(this, {
            uuid: process.env['_CHAR_INFO_ID'],
            properties: ['read']
        });
    }
    async onReadRequest(offset, callback) {

        const res = '{}'
        var val = Buffer.from(res)

        // make API request to firebase.
        
        try {
            const data = await getCamera({ cameraId: sharedInstance.camera_id });
            console.log(data);
            sharedInstance.cloudObject = data;
            await notifyService();

        }catch (e) {
            console.log(e);
        }
        callback(this.RESULT_SUCCESS, val)
    }
}

util.inherits(MMOUpdateCharacteristic, Characteristic)
module.exports = MMOUpdateCharacteristic
