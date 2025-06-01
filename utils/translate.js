import { default as translate } from "@vitalets/google-translate-api";

/**
 * 將文字翻譯成中文
 * @param {string} text 原始輸入
 * @returns {string} 中文翻譯結果
 */
export async function translateToChinese(text) {
  try {
    const res = await translate(text, { to: "zh-TW" });
    return res.text;
  } catch (err) {
    console.error("❌ 翻譯失敗：", err);
    return text; // 翻譯失敗就用原文
  }
}
