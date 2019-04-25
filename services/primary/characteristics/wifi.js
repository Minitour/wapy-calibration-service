// read only
const bleno = require('bleno');
const util = require('util');
const wifi = require('node-wifi');
const sharedInstance = require('../../shared-instance');
const Characteristic = bleno.Characteristic;


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

        var range = offset + sharedInstance.offset.read;
        if (range > val.length) {
          console.log("OUT OF BOUNDS")
          callback(this.RESULT_INVALID_OFFSET, 0);
          return
        }

        val = val.slice(range);
        console.log(val.toString('utf-8'))
        console.log(offset + sharedInstance.offset.read);
        callback(this.RESULT_SUCCESS, val);
    }

    /*
    onWriteRequest(data,offset,withoutResponse,callback) {
      // { "offset" : 0 }
      var res = JSON.parse(data.toString())
      this.lastKnownOffset = res.offset;
      this.blockSize = res.block;
      console.log(`Last known offset: ${this.lastKnownOffset}`)
      callback(this.RESULT_SUCCESS);
    }
    */
}

util.inherits(WifiCharacteristic, Characteristic);

  

module.exports = WifiCharacteristic;