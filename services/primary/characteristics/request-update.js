// write only

const bleno = require('bleno');
const util = require('util');
const sharedInstance = require('../../shared-instance');
const notifyService = require('../../service-notifier');
const App = require('../../firebase-application');
require("firebase/functions");
const functions = App.functions();
const getCamera = functions.httpsCallable('getCamera');

const Characteristic = bleno.Characteristic;

class RequestUpdateCharacteristic {
    constructor() {
        RequestUpdateCharacteristic.super_.call(this, {
            uuid: process.env['_CHAR_RQ_UPDATE_ID'],
            properties: ['write']
        });
    }
    async onWriteRequest(data, offset, withoutResponse, callback) {

        const res = JSON.parse(data.toString());

        // read secret 
        const secret = res.secret_key;

        // if secret is undefined callback error
        if (secret == undefined) {
            console.log('Secret was not passed.');
            callback(this.RESULT_UNLIKELY_ERROR);
            return;
        }

        // if cloudObject secret is undefined
        if (sharedInstance.cloudObject.secret == undefined) {
            console.log('Cloud Object Secret is not defined.');
            callback(this.RESULT_UNLIKELY_ERROR);
            return;
        }

        // if secret mismatches callback error
        if (sharedInstance.cloudObject.secret != secret) {
            console.log('Secret Mismatch.');
            callback(this.RESULT_UNLIKELY_ERROR);
            return;
        } 

        // get camera and callback success
        const cameraId = sharedInstance.cloudObject.id;

        try {
            const result = await getCamera({ cameraId: cameraId });
            console.log(JSON.stringify(data));
            sharedInstance.cloudObject = result.data.data;
            await notifyService();
        } catch (e) {
            console.log(e);
        }

        callback(this.RESULT_SUCCESS);
    }
}

util.inherits(RequestUpdateCharacteristic, Characteristic);
module.exports = RequestUpdateCharacteristic;