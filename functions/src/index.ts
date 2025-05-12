import * as admin from "firebase-admin";
import {onSchedule} from "firebase-functions/v2/scheduler";
// import * as functions from "firebase-functions";
// import fetch from "node-fetch";

admin.initializeApp();

// 匿名ログインアカウントの自動削除
export const deleteOldAnonymousUsers =
onSchedule("every 1 minutes", async (context) => {
  const now = Date.now();
  const fiveMinutesMs = 5 * 60 * 1000;

  let nextPageToken: string | undefined;
  do {
    const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
    for (const user of listUsersResult.users) {
      const isAnonymous = user.providerData.length === 0;
      const creationTime = user.metadata.creationTime ?
        new Date(user.metadata.creationTime).getTime() : 0;
      if (isAnonymous && now - creationTime > fiveMinutesMs) {
        console.log(`Deleting anonymous user: ${user.uid}`);
        await admin.auth().deleteUser(user.uid);
      }
    }
    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);
});

// 釣果投稿時にプッシュ通知送信
// export const sendNewCatchNotification = functions.firestore
//   .document("catches/{catchId}")
//   .onCreate(async (snap, context) => {
//     const catchData = snap.data();
//     const usersSnap = await admin.firestore().collection("users").get();
//     const messages: any[] = [];

//     usersSnap.forEach((doc) => {
//       const user = doc.data();
//       // if (user.areaNotifyPrefs?.includes(catchData.areaName))
//       if (user.expoPushToken && user.uid !== catchData.uid) {
//         messages.push({
//           to: user.expoPushToken,
//           sound: "default",
//           title: "新しい釣果が投稿されました！",
//           body: `${catchData.userName}さんが${catchData.area}で釣果を投稿！`,
//         });
//       }
//     });

//     const chunkedMessages = [];
//     while (messages.length > 0) {
//       chunkedMessages.push(messages.splice(0, 100));
//     }

//     while (messages.length) {
//       const chunk = messages.splice(0, 100); // 100件ずつ
//       await fetch("https://exp.host/--/api/v2/push/send", {
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify(chunk),
//       });
//     }
//   });

