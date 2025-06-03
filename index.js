import "dotenv/config";
import linebot from "linebot";
import express from "express";
import { authorizeSpotify } from "./services/spotify.js";
import { setUserState, getUserState, clearUserState } from "./utils/context.js";
import { character } from "./utils/characters.js";
import generateSpotifyLoginURL from "./utils/generateSpotifyLoginURL.js";
import spotifyCallbackRoute from "./routes/spotifyCallback.js";
import recommendHandler from "./commands/recommend.js";
import searchSong from "./commands/searchSong.js";
import searchFood from "./commands/searchFood.js";
import handlePostback from "./commands/postback.js";
import commandQr from "./commands/qr.js";
import searchFoodFromImage from "./commands/searchFoodFromImage.js";
import eatWhat from "./commands/eatWhat.js";
import qrFoodType from "./commands/qrFoodType.js";
import qrFoodType2 from "./commands/qrFoodType2.js";
import searchNearby from "./commands/searchNearby.js";

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

await authorizeSpotify();

// 啟動 Express 應用來處理 Spotify callback
const app = express();

// 掛載 callback route
app.use("/", spotifyCallbackRoute);
// 新增一個 route 回傳 Spotify 登入連結
app.get("/spotify-login", (req, res) => {
  const url = generateSpotifyLoginURL();
  res.send(`<a href="${url}">點我登入 Spotify</a>`);
});

bot.on("message", async (event) => {
  try {
    // console.log(event);
    const userId = event.source.userId;
    const currentState = getUserState(userId);

    if (event.message.type === "text") {
      const text = event.message.text;
      const msg = event.message.text.trim();
      const lowerMsg = msg.toLowerCase();
      // 嘗試比對角色回應關鍵字
      const match = character.responses.find(({ keywords }) =>
        keywords.some((keyword) => lowerMsg.includes(keyword))
      );
      const reply = match ? match.reply : character.default;

      // 新增這段：處理 /spotify-login 指令
      // if (text === "/spotify-login") {
      //   const url = generateSpotifyLoginURL();
      //   await event.reply(`請點擊以下連結登入 Spotify：\n${url}`);
      //   return;
      // }

      // 第一階段：啟動推薦流程
      if (text.includes("推薦歌曲") || text === "推歌" || text === "suggest") {
        await event.reply("請描述你此刻的心情或想聽的音樂風格～");
        setUserState(userId, "awaiting_music_description");
        return;
      }

      // 使用者輸入情緒關鍵字 → 推薦
      if (currentState === "awaiting_music_description") {
        clearUserState(userId);
        await recommendHandler(event); // 使用關鍵字推薦歌曲
        return;
      }

      // 使用者輸入搜尋歌曲 → 搜尋歌名（不走關鍵字）

      if (
        text.includes("搜尋歌曲") ||
        text === "找歌" ||
        text === "find song"
      ) {
        await event.reply("請輸入你想搜尋的歌曲名稱。");
        setUserState(userId, "awaiting_music_name");
        return;
      }

      if (currentState === "awaiting_music_name") {
        clearUserState(userId);
        await searchSong(event);
        return;
      }

      // 使用者輸入搜尋成分 → 搜尋食物（不走關鍵字）

      if (
        text.includes("搜尋成分") ||
        text === "成分" ||
        text === "find food"
      ) {
        await event.reply("請輸入你想搜尋的食物（或上傳食物圖片）");
        setUserState(userId, "awaiting_food_name");
        return;
      }

      // 如果是等待輸入食物名稱階段，且給的是文字
      if (currentState === "awaiting_food_name") {
        clearUserState(userId);
        await searchFood(event);
        return;
      }

      // 處理食物推薦的回應
      if (currentState?.state === "awaiting_food_decision") {
        if (text === "好啊" || text.includes("好") || text.includes("ok")) {
          await clearUserState(userId);
          await event.reply([
            {
              type: "text",
              text: `太棒了！享用你的「${currentState.lastRecommended}」吧！😋`,
            },
            { type: "sticker", packageId: "789", stickerId: "10855" },
          ]);
          return;
        } else if (
          text === "不要" ||
          text.includes("不要") ||
          text.includes("換")
        ) {
          // 不清除狀態，繼續推薦
          await eatWhat(event); // 重新推薦
          return;
        }
      }

      // 吃什麼推薦 Quick Reply
      if (
        text.includes("早餐") ||
        text.includes("晚餐") ||
        text.includes("中餐") ||
        text.includes("推薦吃") ||
        text.includes("吃什麼") ||
        text.toLowerCase().includes("eat what") ||
        text.toLowerCase().includes("dinner") ||
        text.toLowerCase().includes("breakfast") ||
        text.toLowerCase().includes("lunch")
      ) {
        await eatWhat(event);
        return;
      }

      // 用文字叫出位置查詢
      if (
        text.includes("附近餐廳") ||
        text.includes("推薦附近餐廳") ||
        text.includes("找吃的") ||
        text.includes("找餐廳")
      ) {
        console.log("觸發餐廳類型選擇，文字:", text); // 除錯用
        await qrFoodType(event);
        return;
      }

      // 處理更多餐廳選項
      if (text === "更多餐廳選項") {
        await qrFoodType2(event); // 新增第二組選項
        return;
      }

      // 處理回到第一組
      if (text === "餐廳類型第一組") {
        await qrFoodType(event);
        return;
      }

      // 使用者選了類型，如：找火鍋
      const foodSearchMatch = text.match(/^找(.{2,6})$/);
      if (foodSearchMatch) {
        const keyword = foodSearchMatch[1];

        if (keyword === "隨便") {
          // 直接呼叫隨機推薦
          await eatWhat(event);
          return;
        }

        // 儲存用戶想要的餐廳類型，等待位置分享
        setUserState(userId, {
          state: "awaiting_location",
          wantType: keyword,
        });

        await event.reply([
          {
            type: "text",
            text: `好的！幫您找附近的${keyword}餐廳 🔍\n請分享您的位置：`,
          },
          {
            type: "text",
            text: "點擊下方按鈕分享位置 📍",
            quickReply: {
              items: [
                {
                  type: "action",
                  action: {
                    type: "location",
                    label: "📍 分享我的位置",
                  },
                },
              ],
            },
          },
        ]);
        return;
      }

      // 功能介紹：萬萬有什麼功能？
      if (
        text.includes("萬萬有什麼功能") ||
        text.includes("萬萬可以做什麼") ||
        text.includes("功能") ||
        text.toLowerCase().includes("help")
      ) {
        commandQr(event);
        return;
      }
      return event.reply(`${reply}`);
    } else if (
      event.message.type === "image" &&
      currentState === "awaiting_food_name"
    ) {
      clearUserState(userId);
      await searchFoodFromImage(event); //
      return;
    } else if (event.message.type === "sticker") {
      await event.reply([
        { type: "text", text: "可愛的貼圖！" },
        { type: "sticker", packageId: "789", stickerId: "10857" },
      ]);
    } else if (event.message.type === "image") {
      await event.reply([
        { type: "text", text: "謝謝你分享的圖片！" },
        { type: "sticker", packageId: "789", stickerId: "10863" },
      ]);
    } else if (event.message.type === "location") {
      const userState = getUserState(userId);

      if (userState?.state === "awaiting_location" && userState?.wantType) {
        const { latitude, longitude } = event.message;

        // 呼叫搜尋附近餐廳，傳入座標和餐廳類型
        await searchNearby(event, latitude, longitude);
        return;
      }
      await event.reply([
        { type: "text", text: "謝謝你分享的位置！" },
        { type: "sticker", packageId: "789", stickerId: "10861" },
      ]);
    } else {
      await event.reply([
        { type: "text", text: "我不太明白這個訊息類型。" },
        { type: "sticker", packageId: "8522", stickerId: "16581287" },
      ]);
    }
  } catch (error) {
    console.error("錯誤回復：", error);
    // You can also send a message to the user in case of an error
    await event.reply("不好意思，發生錯誤了。");
  }
});

bot.on("postback", async (event) => {
  try {
    await handlePostback(event);
  } catch (error) {
    console.error("Postback 錯誤：", error);
    await event.reply("發生錯誤，請稍後再試。");
  }
});

// LineBot.listen(webHookPath, port, callback)
bot.listen("/", 3000, () => {
  console.log("機器人啟動在 port 3000");
});

const CALLBACK_PORT = 3010;
app.listen(CALLBACK_PORT, () => {
  console.log(`Spotify 授權伺服器運行中：http://localhost:${CALLBACK_PORT}`);
});
