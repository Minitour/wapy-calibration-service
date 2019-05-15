//read only
const bleno = require('bleno');
const util = require('util');
const wifi = require('node-wifi');
const sharedInstance = require('../../shared-instance');
const Characteristic = bleno.Characteristic;

function getCurrentWifi() {
    return new Promise((res,rej)=> {
        wifi.getCurrentConnections(function(err, currentConnections) {
            if (err) {
                console.log(err);
                rej(err);
                return;
            }

            if (currentConnections.length == 0) {
                rej(undefined);
                return;
            }

            res(currentConnections[0]);
        });
    });
}

class InfoCharacteristic {
    constructor() {
        InfoCharacteristic.super_.call(this, {
            uuid: process.env['_CHAR_INFO_ID'],
            properties: ['read']
        });
    }
    async onReadRequest(offset, callback) {
        // TODO: create data object from real data.
        // The payload to send. This data should be read from a singleton.

        const cloudObject = sharedInstance.cloudObject;
        const isCalibrated = !(cloudObject == undefined);        
        var version = undefined;
        var ssid = undefined;
        var name = undefined;
        
        if (isCalibrated) {
            name = cloudObject.name;
            version = cloudObject.version;
        }

        try {
            const currentWifi = await getCurrentWifi();
            ssid = currentWifi.ssid;
        }catch { 
            console.log('Not connected yet.');
        }

        const data = {
            'version' : version,
            'name' : name,
            'calibrated' : isCalibrated,
            'network': ssid
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
        callback(this.RESULT_SUCCESS, val);
    }
}

util.inherits(InfoCharacteristic, Characteristic);

  

module.exports = InfoCharacteristic;
