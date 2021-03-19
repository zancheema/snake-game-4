const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendNotification = functions.firestore
    .document("users/{userId}/notifications/{notificationId}")
    .onCreate((snap, context) => {
      const values = snap.data();
      const notificationId = values.notificationId;

      if (notificationId == "friendRequest") {
        sendFriendRequest(values);
      }
    });

/**
 * send friend request notification
 * @param {map} values arguments for generating payload
 */
function sendFriendRequest(values) {
  const token = values.messagingToken;

  const payload = {
    notification: {
      title: values.username,
      body: "Lets be friends",
    },
  };

  admin.messaging().sendToDevice(token, payload);
}

