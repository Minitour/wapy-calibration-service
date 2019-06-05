
const App = require('./firebase-application');
const db = App.firestore();

var cancelSubscription = undefined;

async function startObserving(cameraId) {
    // cancel subscription before creating a new one.
    stopObserving();

    if (cameraId == undefined) {
        console.log("Camera ID Is undefined!");
        return
    }

    const doc = db.collection('cameras').doc(cameraId);

    cancelSubscription = doc.onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
            updateRecrod(documentSnapshot);
        }
    }, err => {
        console.log(`Encountered error: ${err}`);
    });
}

async function stopObserving() {
    if (cancelSubscription) {
        cancelSubscription();
    }
}

async function updateRecrod(doc) {
    // cancel subscription in order to not affect updates.
    stopObserving();

    // make updates
    const data = doc.data();

    const cameraEnabled = data.camera_enabled;

    if (cameraEnabled) {
        // turn on camera
        await fetch('http://localhost:8001/camera/1', { method: 'POST' });
    } else {
        // turn camera off
        await fetch('http://localhost:8001/camera/0', { method: 'POST' });
    }

    // update record
    await doc.update({ last_updated: new Date().getTime() });

    // start observing
    startObserving(doc.id);
}


module.exports = {
    start: startObserving,
    stop: stopObserving
}