const fetch = require('node-fetch');
const fs = require('fs');
const sharedInstance = require('../services/shared-instance');

const writeFilePromise = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, error => {
            if (error) reject(error);
            resolve("file created successfully with handcrafted Promise!");
        });
    });
};

module.exports = async function() {
    const cloudObject = sharedInstance.cloudObject;
    
    
    console.log(JSON.stringify(cloudObject))

    await writeFilePromise('camera.json', JSON.stringify(cloudObject));

    // write that to disk
    await writeFilePromise('mmo.json', JSON.stringify(cloudObject.mmo));

    // call service manager to restart the service
    await fetch('http://localhost:8001/camera/2', { method: 'POST'});
}