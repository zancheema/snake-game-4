const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendNotification = functions.firestore
    .document("users/{userId}/notifications/{notificationId}")
    .onCreate((snap, context) => {
      const values = snap.data();
      const token = values.receiverToken;

      const payload = {
        notification: {
          title: values.title,
          body: values.body,
        },
      };
      const options = {
        priority: "high",
        timeToLive: 60 * 60 *24,
      };

      admin.messaging().sendToDevice(token, payload, options);
    });
