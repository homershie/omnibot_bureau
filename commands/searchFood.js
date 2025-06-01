import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { translateToEnglish } = require("../utils/translate.js");

import { searchUSDAFood } from "../services/usda.js";
import { formatUSDAResult } from "../utils/formatUSDA.js";

export default async function searchFood(event) {
  const userInput = event.message.text;

  try {
    const enKeyword = await translateToEnglish(userInput);
    const food = await searchUSDAFood(enKeyword);
    const result = formatUSDAResult(food, userInput);

    await event.reply(result);
  } catch (error) {
    console.error("❌ 搜尋熱量錯誤：", error);
    await event.reply("查詢過程發生錯誤，請稍後再試 🙏");
  }
}
