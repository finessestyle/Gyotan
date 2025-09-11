import admin from "firebase-admin";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import fetch from "node-fetch";

// Functionsで管理するAPIキー
const OPEN_AI_API_KEY = process.env.OPENAI_KEY;
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN;

admin.initializeApp();

// 毎週月曜 9:00 に実行
export const postWeeklyFishingTips = onSchedule("0 9 * * 1", async () => {
  const areas = [
    "北湖北岸",
    "北湖東岸",
    "北湖西岸",
    "南湖東岸",
    "南湖南岸",
  ];

  const now = new Date();
  const weekId = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

  for (const area of areas) {
    const prompt = `今週の琵琶湖バス釣り(${area})のおすすめ釣り方を200文字以内で生成してください。`;
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPEN_AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{role: "user", content: prompt}],
      }),
    });

    const aiData = await aiRes.json();
    const tip = aiData.choices?.[0]?.message?.content ?
      aiData.choices[0].message.content :
      "釣果情報をお楽しみに！";

    const tweet =
      "🎣今週の${area}バス釣り🎣\n" +
      "${tip}\n" +
      "釣果投稿は👇で\n" +
      "https://apps.apple.com/app/gyotan/id6745893318\n" +
      "#琵琶湖バス釣り #Gyotan #琵琶湖 #琵琶湖 バス釣り";

    await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${X_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({text: tweet}),
    });

    await admin
      .firestore()
      .collection("weeklyTips")
      .doc(weekId)
      .collection("areas")
      .doc(area)
      .set({
        area,
        tip,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  }
});

// 匿名ログインアカウントの自動削除
export const deleteOldAnonymousUsers = onSchedule(
  "every 1 minutes",
  async () => {
    const now = Date.now();
    const fiveMinutesMs = 5 * 60 * 1000;

    let nextPageToken: string | undefined;
    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      for (const user of listUsersResult.users) {
        const isAnonymous = user.providerData.length === 0;
        const creationTime = user.metadata.creationTime ?
          new Date(user.metadata.creationTime).getTime() :
          0;
        if (isAnonymous && now - creationTime > fiveMinutesMs) {
          console.log(`Deleting anonymous user: ${user.uid}`);
          await admin.auth().deleteUser(user.uid);
        }
      }
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);
  });

// 釣果投稿時のプッシュ通知
interface PushMessage {
  to: string;
  sound: string;
  title: string;
  body: string;
  data?: {postId: string};
}

export const sendNewCatchNotification = onDocumentCreated(
  "posts/{postId}",
  async (event) => {
    const postData = event.data?.data();
    const postId = event.params.postId;
    if (!postData) return;

    const usersSnap = await admin.firestore().collection("users").get();
    const messages: PushMessage[] = [];

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
  }
);
