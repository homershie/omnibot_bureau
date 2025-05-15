import "dotenv/config";

// proocess是node.js的全域物件，內建了很多有用的屬性和方法
// process.env 是一個物件，包含了所有的環境變數
// dotenv/config 會自動讀取 .env 檔案，並把裡面的變數放到 process.env 裡面
// console.log(process.env.CHANNEL_ID);

import linebot from "linebot";
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

bot.on("message", async (event) => {
  try {
    // console.log(event);
    if (event.message.type === "text") {
      await event.reply("謝謝你的訊息！你說的是：" + event.message.text);
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

// LineBot.listen(webHookPath, port, callback)
bot.listen("/", 3000, () => {
  console.log("機器人啟動在 port 3000");
});
