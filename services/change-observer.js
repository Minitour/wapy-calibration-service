
const App = require('./firebase-application');
const db = App.firestore();

var cancelSubscription = undefined;
var knownDocument = undefined;

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
            if (knownDocument == undefined || !documentSnapshot.isEqual(knownDocument)) {
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
    console.log(data);

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

    knownDocument = doc;
    // update record
    // console.log("Updating document.")
    // try {
    //     await docRef.update({ last_updated: new Date().getTime() });
    // }catch(e) {
    //     console.log(e);
    // }

    // start observing
    startObserving(doc.id);
}


module.exports = {
    start: startObserving,
    stop: stopObserving
}