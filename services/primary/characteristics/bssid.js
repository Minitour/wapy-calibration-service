// write only

const bleno = require('bleno');
const util = require('util');
const wifi = require('node-wifi');
const firebase = require('firebase');
const sharedInstance = require('../../shared-instance');

const Characteristic = bleno.Characteristic;


wifi.init({iface:null})

async function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

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

            console.log(`Connecting to network with SSID: ${ssid}`);
            await connectToNetwork(config);

            // wait 3 seconds to ensure the connection worked.
            // TODO: replace with while?
            await sleep(3000);

            // login with firebase token.
            console.log('Logging in to firebase...');
            await firebase.auth().signInWithCustomToken(sharedInstance.token);
            
            callback(this.RESULT_SUCCESS);
        }catch (e){
            console.log(e);
            callback(this.RESULT_UNLIKELY_ERROR)
        }
      }
}

util.inherits(SSIDCharacteristic, Characteristic);
module.exports = SSIDCharacteristic;