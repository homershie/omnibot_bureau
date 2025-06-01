import "dotenv/config";
import linebot from "linebot";
import express from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { authorizeSpotify, searchTracks } from "./services/spotify.js";
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
      if (text.includes("推薦歌曲") || text === "推歌") {
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

      if (text.includes("搜尋歌曲") || text === "找歌") {
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

      if (text.includes("搜尋成分") || text === "成分") {
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
      await event.reply("可愛的貼圖！");
    } else if (event.message.type === "image") {
      await event.reply("謝謝你分享的圖片！");
    } else {
      await event.reply("我不太明白這個訊息類型。");
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
