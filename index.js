import "dotenv/config";
import linebot from "linebot";
import SpotifyWebApi from "spotify-web-api-node";
import { authorizeSpotify, searchTracks } from "./services/spotify.js";
import { getWikipediaSummary } from "./services/wikipedia.js";
import recommendHandler from "./commands/recommend.js";
import searchHandler from "./commands/searchSong.js";
import { setUserState, getUserState, clearUserState } from "./utils/context.js";
import commandQr from "./commands/qr.js";

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

await authorizeSpotify();

bot.on("message", async (event) => {
  try {
    // console.log(event);
    if (event.message.type === "text") {
      const userId = event.source.userId;
      const text = event.message.text;

      const currentState = getUserState(userId);

      // 第一階段：啟動推薦流程
      if (text.includes("推薦歌曲") || text === "推薦") {
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

      if (text.includes("搜尋歌曲") || text === "搜尋") {
        await event.reply("請輸入你想搜尋的歌曲名稱。");
        setUserState(userId, "awaiting_music_name");
        return;
      }

      if (currentState === "awaiting_music_name") {
        clearUserState(userId);
        await searchHandler(event);
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
      }
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
  const data = event.postback.data;

  if (data.startsWith("action=explain")) {
    const params = new URLSearchParams(data);
    const title = params.get("title");
    const artist = params.get("artist");

    const summary = await getWikipediaSummary(title);

    await event.reply({
      type: "text",
      text: summary
        ? `🎵 ${title} 的背景故事：\n\n${summary}`
        : `❌ 找不到「${title}」的相關介紹，請試試其他歌曲名稱。`,
    });
  }
});

// LineBot.listen(webHookPath, port, callback)
bot.listen("/", 3000, () => {
  console.log("機器人啟動在 port 3000");
});
