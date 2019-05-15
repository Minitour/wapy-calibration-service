// read only
const bleno = require('bleno');
const util = require('util');
const wifi = require('node-wifi');
const sharedInstance = require('../../shared-instance');
const Characteristic = bleno.Characteristic;


wifi.init({ iface: null })

function getNetworks() {
  return new Promise((res, rej) => {
    wifi.scan((err, networks) => {
      if (err) {
        rej(err);
      } else {
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
      'ttl': -1,
      'networks': []
    }
  }

  async onReadRequest(offset, callback) {

    var data = {}

    if (this.wifiData.ttl < new Date().getTime()) {
      console.log("Wifi Data Expired. fetching new data")

      // disconnect if needed
      try {
        await wifi.disconnect();
      } catch (error) {
        console.log(err);
      }

      // scan networks
      try {
        this.wifiData.networks = await getNetworks();
      } catch (error) {
        console.log(error)
        this.wifiData.networks = []
      }

      // set new ttl
      this.wifiData.ttl = new Date().getTime() + 3000
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
}

util.inherits(WifiCharacteristic, Characteristic);



module.exports = WifiCharacteristic;