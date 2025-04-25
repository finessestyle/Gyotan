import * as admin from "firebase-admin";
import {onSchedule} from "firebase-functions/v2/scheduler";// 正しいインポート

admin.initializeApp();

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
