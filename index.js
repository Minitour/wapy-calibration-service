/*
a741315176f54a56b5cf999e1c8491c8 // serivce id
d60bc3bc20694eb78c69e2ba01b03553 // info char
307fd0967cd34a159fa05cfdbca97342 // wifi char
805b0d5b00d9427c84517441c22b46ca // write offset
0aadbf253f94452d82c9ce3f045ee51f // read offset
a33c9d54e26e42e8ad99b58293e4249a // token
62221e9cfea145de865c8d718dd6a98f // ssid
3367142e91d445128ac6e64bb57ae9c8
336165350c8f4ef9b3588893fb87c859
d2223a9f75c343ada4da20254e460c72
 */
const ADVERTISMENT_NAME = 'WAPY BOX';
process.env['BLENO_DEVICE_NAME'] = ADVERTISMENT_NAME;
process.env['_SERVICE_ID'] = 'a741315176f54a56b5cf999e1c8491c8';
process.env['_CHAR_INFO_ID'] = 'd60bc3bc20694eb78c69e2ba01b03553';
process.env['_CHAR_WIFI_ID'] = '307fd0967cd34a159fa05cfdbca97342';
process.env['_CHAR_WRITE_ID'] = '805b0d5b00d9427c84517441c22b46ca';
process.env['_CHAR_READ_ID'] = '0aadbf253f94452d82c9ce3f045ee51f';
process.env['_CHAR_TOKEN_ID'] = 'a33c9d54e26e42e8ad99b58293e4249a';
process.env['_CHAR_BSSID_ID'] = '62221e9cfea145de865c8d718dd6a98f';

const sharedInstance = require('./services/shared-instance');
sharedInstance.data = 'hello world';

const bleno = require('bleno')


const PrimaryService = require('./services/primary/service');

var services = [
    new PrimaryService()
]

var servicesUuids = services.map( service => service.uuid);

console.log(servicesUuids)

bleno.on('advertisingStart', err => {
    console.log('started ad');
    bleno.setServices(services, err => {
        if (err) {
            console.log(`[setServices] ${err}`)
        }
    })
})

bleno.on('advertisingStartError',err => {
    if (err) {
        console.log(`[advertisingStartError] ${err}`)
    }
})


bleno.on('stateChange', state => {
    console.log(`[State Changed] ${state}`);

    if (state == 'poweredOn') {
        // start advertising
        console.log('startAdvertising')
        bleno.startAdvertising(ADVERTISMENT_NAME, servicesUuids)
    }
})
