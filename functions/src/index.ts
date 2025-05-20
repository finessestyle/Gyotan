import * as admin from "firebase-admin";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import fetch from "node-fetch";

admin.initializeApp();

// 匿名ログインアカウントの自動削除（v2スケジューラー）
export const deleteOldAnonymousUsers =
onSchedule("every 1 minutes", async () => {
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

// 釣果投稿時のプッシュ通知（v2 Firestoreトリガー）
export const sendNewCatchNotification =
onDocumentCreated("posts/{postId}", async (event) => {
  const postData = event.data?.data();
  const postId = event.params.postId;
  if (!postData) return;

  const usersSnap = await admin.firestore().collection("users").get();
  const messages: Array<Record<string, any>> = [];

  usersSnap.forEach((doc) => {
    const user = doc.data();
    if (user.expoPushToken && user.uid !== postData.uid) {
      messages.push({
        to: user.expoPushToken,
        sound: "default",
        title: "新しい釣果が投稿されました！",
        body: `${postData.userName}さんが${postData.area}で釣果を投稿！`,
        data: {postId},
      });
    }
  });

  while (messages.length > 0) {
    const chunk = messages.splice(0, 100);
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(chunk),
    });
  }
});
