import axios from "axios";
import "dotenv/config";

const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";
const API_KEY = process.env.DEEPL_API_KEY;

// 動態匯入 OpenCC
let converter;
async function getConverter() {
  if (!converter) {
    const OpenCC = await import("opencc-js");
    converter = OpenCC.Converter({ from: "cn", to: "tw" });
  }
  return converter;
}

/**
 * 將文字翻譯為英文
 * @param {string} text
 * @returns {Promise<string>}
 */
export async function translateToEnglish(text) {
  try {
    const res = await axios.post(DEEPL_API_URL, null, {
      params: {
        auth_key: API_KEY,
        text: text,
        target_lang: "EN",
      },
    });
    return res.data.translations[0].text;
  } catch (err) {
    console.error("❌ 翻譯成英文失敗：", err.response?.data || err.message);
    return text;
  }
}

/**
 * 將文字翻譯為中文（繁體）
 * @param {string} text
 * @returns {Promise<string>}
 */
export async function translateToChinese(text) {
  try {
    const res = await axios.post(DEEPL_API_URL, null, {
      params: {
        auth_key: API_KEY,
        text: text,
        target_lang: "ZH",
      },
    });
    const simplified = res.data.translations[0].text;
    const conv = await getConverter();
    return conv(simplified); // 將簡體轉為繁體
  } catch (err) {
    console.error("❌ 翻譯成中文失敗：", err.response?.data || err.message);
    return text;
  }
}
