const ADVERTISMENT_NAME = 'WAPY BOX';
process.env['BLENO_DEVICE_NAME'] = ADVERTISMENT_NAME;
const bleno = require('bleno')

const InfoService = require('./services/info-service/info-service');

var services = [
    new InfoService()
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
