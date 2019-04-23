const bleno = require('bleno');
const util = require('util');
const Characteristic = bleno.Characteristic;
const wifi = require('node-wifi');

wifi.init({iface:null})

function getNetworks(){
  return new Promise( (res,rej)=>{
    wifi.scan((err, networks)=> {
      if (err) {
        rej(err);
      }else {
        res(networks);
      }
    })
  });
}

class WifiCharacteristic {

    constructor() {
        WifiCharacteristic.super_.call(this, {
            uuid: process.env['_CHAR_WIFI_ID'],
            properties: ['read']
        });
        this.wifiData = {
          'ttl' : -1,
          'networks': []
        }
    }
    async onReadRequest(offset, callback) {

      var data = {}

        // if ttl > now + 1 min
        if (this.wifiData.ttl < new Date().getTime()){
          console.log("Wifi Data Expired. fetching new data")
          try {
            this.wifiData.networks =  await getNetworks();
          } catch(error) {
            console.log(error)
            this.wifiData.networks = []
          }
          
          // set new ttl
          this.wifiData.ttl = new Date().getTime() + 300000
        }

        data.networks = this.wifiData.networks
        data.lastscanned = this.wifiData.ttl
    
        // update ttl for additional 3 seconds
        this.wifiData.ttl += 100

        
        // send response
        const res = JSON.stringify(data)
        var val = Buffer.from(res)
        val = val.slice(offset, val.length - offset); // based on apple docs
        console.log(val.toString('utf-8'))
        
        console.log(offset)
        callback(this.RESULT_SUCCESS, val);
    }
}

util.inherits(WifiCharacteristic, Characteristic);

  

module.exports = WifiCharacteristic;