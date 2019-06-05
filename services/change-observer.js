
const App = require('./firebase-application');
const db = App.firestore();

var cancelSubscription = undefined;
var knownDocument = undefined;
var cameraState = undefined;

async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }

async function startObserving(cameraId) {
    // cancel subscription before creating a new one.
    stopObserving();

    if (cameraId == undefined) {
        console.log("Camera ID Is undefined!");
        return
    }

    console.log(`Creating Reference to camera ${cameraId}`);
    const doc = db.collection('cameras').doc(cameraId);

    console.log("Creating Subscription");
    cancelSubscription = doc.onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {

            if (knownDocument == undefined) {
                console.log('knownDocument is undefined')
                updateRecrod(documentSnapshot);
                return
            }
            console.log(documentSnapshot.updateTime)
            if (documentSnapshot.updateTime != knownDocument.updateTime) {
                console.log('knownDocument is not equal to documentSnapshot')
                console.log(knownDocument.updateTime)
                updateRecrod(documentSnapshot);
            }

        }
    }, err => {
        console.log(`Encountered error: ${err}`);
    });
}

async function stopObserving() {
    if (cancelSubscription) {
        console.log("Canceling Existing Subscription");
        cancelSubscription();
    }
}

async function updateRecrod(doc) {
    // cancel subscription in order to not affect updates.
    stopObserving();

    // make updates
    const data = doc.data();

    const cameraEnabled = data.camera_enabled;

    console.log("updateRecrod:");

    // as long as the state is different from the last known state.
    if (cameraState != cameraEnabled) {
        try {
            if (cameraEnabled) {
                // turn on camera
                console.log("updateRecrod: Turning camera service on.");
                await fetch('http://localhost:8001/camera/1', { method: 'POST' });
            } else {
                // turn camera off
                console.log("updateRecrod: Shutting down camera service.");
                await fetch('http://localhost:8001/camera/0', { method: 'POST' });
            }
        } catch (e) {
            console.log(e);
        }
    }
    cameraState = cameraEnabled;

    // update the document (notify ping)
    try {
        await doc.ref.update({ last_ping: new Date().getTime() });
    } catch (e) {
        console.log('Failed to update.');
    }

    knownDocument = await doc.ref.get();

    await sleep(3000);

    // start observing
    startObserving(doc.id);
}

module.exports = {
    start: startObserving,
    stop: stopObserving
}