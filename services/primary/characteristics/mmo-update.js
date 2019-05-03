//read only
const bleno = require('bleno');
const util = require('util');
const sharedInstance = require('../../shared-instance');

const Characteristic = bleno.Characteristic;
const firebase = require("firebase");
require("firebase/functions");
const functions = firebase.functions();

const GetCamera = firebase.functions().httpsCallable('getCamera');

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

        // TODO: make API request to firebase.
        

        callback(this.RESULT_SUCCESS, val)
    }
}

util.inherits(MMOUpdateCharacteristic, Characteristic)
module.exports = MMOUpdateCharacteristic
