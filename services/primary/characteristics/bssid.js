// write only

const bleno = require('bleno');
const util = require('util');
const wifi = require('node-wifi');
const sharedInstance = require('../../shared-instance');

const Characteristic = bleno.Characteristic;

wifi.init({iface:null})

function getNetworkSSIDFrom(bssid){
  return new Promise( (res,rej)=>{
    wifi.scan((err, networks)=> {
      if (err) {
        rej(err);
      }else {
        var ssid = undefined;
        
        networks.forEach( element => {
            if (element.bssid === bssid) {
                ssid = element.ssid;
            }
        });

        // if ssid was found return ssid
        if (ssid) {
            res(ssid);
        } else {
        // else reject
            rej(undefined);
        }
      }
    })
  });
}

function connectToNetwork(config) {
    return new Promise( (res,rej)=>{
        wifi.connect( config, (err) => {
              if (err) {
                rej(undefined);
              }
              res(true);
            }
        );
    });
}

class SSIDCharacteristic {
    constructor() {
        SSIDCharacteristic.super_.call(this, {
            uuid: process.env['_CHAR_BSSID_ID'],
            properties: ['write']
        });
    }
    async onWriteRequest(data, offset, withoutResponse, callback) {
        // expects: {"bssid" : "ssid", "password" : "the password"}
        const res = JSON.parse(data.toString());
        
        const ssid = await getNetworkSSIDFrom(res.bssid);
        const config = { 'ssid': ssid, 'password' : res.password }

        try {
            await connectToNetwork(config);
            callback(this.RESULT_SUCCESS);
        }catch (e){
            callback(this.RESULT_UNLIKELY_ERROR)
        }
      }
}

util.inherits(SSIDCharacteristic, Characteristic);
module.exports = SSIDCharacteristic;