const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

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

exports.unreadMessagesCount = functions.firestore
    .document("users/{userId}/chats/{chatId}/messages/{messageId}")
    .onCreate(async (snap, context) => {
      // return if the message is sent by the same user
      if (snap.data().mine) return;

      const uid = context.params.userId;
      const unreadMessagesDoc =
        db.doc(`users/${uid}/chatFunctions/unreadMessages`);

      try {
        const unreadMessages = await unreadMessagesDoc.get();
        const count = unreadMessages.data().totalCount;
        await unreadMessagesDoc.set({totalCount: count + 1});
      } catch (e) {
        await unreadMessagesDoc.set({totalCount: 1});
      }
    });
