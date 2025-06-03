import foodList from "../utils/foodList.js";
import { setUserState } from "../utils/context.js";

export default async function eatWhat(event) {
  // 檢查 foodList 是否有內容
  if (!foodList || foodList.length === 0) {
    await event.reply("目前沒有可推薦的食物選項！");
    return true;
  }

  // 隨機選擇一個食物
  const randomPick = foodList[Math.floor(Math.random() * foodList.length)];

  // 設定使用者狀態，記錄當前推薦的食物
  await setUserState(event.source.userId, {
    state: "awaiting_food_decision",
    lastRecommended: randomPick.name,
  });

  await event.reply({
    type: "text",
    text: `那就吃「${randomPick.name}」吧！🍽\n你覺得怎麼樣？`,
    quickReply: {
      items: [
        {
          type: "action",
          action: {
            type: "message",
            label: "👍 好啊",
            text: "好啊",
          },
        },
        {
          type: "action",
          action: {
            type: "message",
            label: "👎 不要",
            text: "不要",
          },
        },
      ],
    },
  });

  return true;
}
