import { detectFoodLabelFromBuffer } from "../services/vision.js";
import { translateToChinese, translateToEnglish } from "../utils/translate.js";
import { searchUSDAFood } from "../services/usda.js";
import { formatUSDAResult } from "../utils/formatUSDA.js";

// 處理 LINE content 回傳的資料，轉成 Buffer
async function getBufferFromContent(stream) {
  if (Buffer.isBuffer(stream)) {
    return stream;
  }

  if (typeof stream.on === "function") {
    const chunks = [];
    return new Promise((resolve, reject) => {
      stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", (error) => reject(error));
    });
  }

  if (stream instanceof Uint8Array) {
    return Buffer.from(stream);
  }

  return Buffer.from(stream); // fallback
}

export default async function searchFoodFromImage(event) {
  try {
    const content = await event.message.content();
    const buffer = await getBufferFromContent(content);

    const label = await detectFoodLabelFromBuffer(buffer); // ← 可能是中文

    console.log("🔍 辨識出的食物名稱：", label);
    if (!label) {
      await event.reply("辨識不到圖片中的食物種類 😢，可以嘗試換一張圖片喔！");
      return;
    }

    const enLabel = await translateToEnglish(label); // ⭐ 翻譯為英文查 USDA
    const foodData = await searchUSDAFood(enLabel);
    if (!foodData) {
      await event.reply(
        `查不到「${enLabel}」的營養資料，可能不是可食用項目 😢`
      );
      return;
    }

    const zhName = await translateToChinese(enLabel); // 為了顯示中文名稱
    const result = formatUSDAResult(foodData, zhName);

    await event.reply(result);
  } catch (err) {
    console.error("❌ 食物圖片分析錯誤：", err);
    await event.reply("處理圖片時發生錯誤，請稍後再試。");
  }
}
