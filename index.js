bot.on("message", async (event) => {
  try {
    const userId = event.source.userId;
    const currentState = getUserState(userId);

    if (event.message.type === "text") {
      const text = event.message.text;
      const msg = text.trim();
      const lowerMsg = msg.toLowerCase();

      // 嘗試比對角色回應關鍵字
      const match = character.responses.find(({ keywords }) =>
        keywords.some((keyword) => lowerMsg.includes(keyword))
      );
      const reply = match ? match.reply : character.default;

      // 第一階段：啟動推薦流程
      if (text.includes("推薦歌曲") || text === "推歌") {
        await event.reply("請描述你此刻的心情或想聽的音樂風格～");
        setUserState(userId, "awaiting_music_description");
        return;
      }

      // 使用者輸入情緒關鍵字 → 推薦
      if (currentState === "awaiting_music_description") {
        clearUserState(userId);
        await recommendHandler(event);
        return;
      }

      // 使用者輸入搜尋歌曲 → 搜尋歌名
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

      // 使用者輸入搜尋成分 → 搜尋食物
      if (text.includes("搜尋成分") || text === "成分") {
        await event.reply("請輸入你想搜尋的食物（或上傳食物圖片）");
        setUserState(userId, "awaiting_food_name");
        return;
      }

      if (currentState === "awaiting_food_name") {
        clearUserState(userId);
        await searchFood(event);
        return;
      }

      // 功能介紹
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
      await searchFoodFromImage(event);
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
    await event.reply("不好意思，發生錯誤了。");
  }
});
