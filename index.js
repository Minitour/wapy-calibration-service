
process.env['BLENO_DEVICE_NAME'] = 'custom device name';
var bleno = require('bleno-mac');
var serviceUuids = ['fffffffffffffffffffffffffffffff0']

var PrimaryService = bleno.PrimaryService;

var Characteristic = bleno.Characteristic;

var Descriptor = bleno.Descriptor;

var characteristic = new Characteristic({
    uuid: 'fffffffffffffffffffffffffffffff1', // or 'fff1' for 16-bit
    properties: [ 'read'], // can be a combination of 'read', 'write', 'writeWithoutResponse', 'notify', 'indicate' // enable security for properties, can be a combination of 'read', 'write', 'writeWithoutResponse', 'notify', 'indicate'
    value: 'some default value', // optional static value, must be of type Buffer - for read only characteristics
    descriptors: [
        new Descriptor({
          uuid: '2901',
          value: 'Battery level between 0 and 100 percent'
        }),
        // new Descriptor({
        //   uuid: '2904',
        //   value: new Buffer([0x04, 0x01, 0x27, 0xAD, 0x01, 0x00, 0x00 ]) // maybe 12 0xC unsigned 8 bit
        // })
      ],
    onReadRequest: function(offset, callback) {
        console.log(offset)
        callback(this.RESULT_SUCCESS, new Buffer([939]));
     }, // optional read request handler, function(offset, callback) { ... }
    onWriteRequest: null, // optional write request handler, function(data, offset, withoutResponse, callback) { ...}
    onSubscribe: null, // optional notify/indicate subscribe handler, function(maxValueSize, updateValueCallback) { ...}
    onUnsubscribe: null, // optional notify/indicate unsubscribe handler, function() { ...}
    onNotify: null, // optional notify sent handler, function() { ...}
    onIndicate: null // optional indicate confirmation received handler, function() { ...}
});

var primaryService = new PrimaryService({
    uuid: 'fffffffffffffffffffffffffffffff0', // or 'fff0' for 16-bit
    characteristics: [
        characteristic
    ]
});


bleno.on('advertisingStart', err => {
    console.log('started ad');
    bleno.setServices([primaryService], err => {
        console.log('something went wrong');
        console.log(err);
    })
})

bleno.on('advertisingStartError',err => {
    console.log(`error: ${err}`)
})


bleno.on('stateChange', state => {
    console.log(`State Changed: ${state}`);

    if (state == 'poweredOn') {
        // start advertising
        console.log('starting adver')
        bleno.startAdvertising('my ad',serviceUuids)
    }
})
