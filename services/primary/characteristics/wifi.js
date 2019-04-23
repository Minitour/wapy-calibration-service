const bleno = require('bleno');
const util = require('util');

const Characteristic = bleno.Characteristic;



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
    onReadRequest(offset, callback) {

      var data = {}

        // if ttl > now + 1 min
        if (this.wifiData.ttl < new Date().getTime()){
          console.log("Wifi Data Expired. fetching new data")
          var newData = ['net1','net2','net3']
          this.wifiData.networks = newData
          // set new ttl
          this.wifiData.ttl = new Date().getTime() + 300000
        }

        data.networks = this.wifiData.networks
        data.lastscanned = this.wifiData.ttl
    
        // update ttl for additional 3 seconds
        this.wifiData.ttl += 3000

        
        // send response
        const res = JSON.stringify(data)
        console.log(res)
        callback(this.RESULT_SUCCESS, Buffer.from(res).slice(offset, offset + 184));
    }
}

util.inherits(WifiCharacteristic, Characteristic);

  

module.exports = WifiCharacteristic;