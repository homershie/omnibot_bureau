// utils/keyword-fuse.js
import Fuse from "fuse.js";
import emotionData from "./searchData.js";
import aliasMap from "./aliasMap.js";

const fuse = new Fuse(emotionData, {
  keys: ["keyword"],
  threshold: 0.4,
});

export default function extractKeywordsFromText(text) {
  const lowerText = text.toLowerCase();

  // 先從 alias 對照英文 → 中文 keyword
  for (const [en, zh] of Object.entries(aliasMap)) {
    if (lowerText.includes(en)) {
      const result = fuse.search(zh);
      if (result.length > 0) return result[0].item.tags;
    }
  }

  // fallback：直接用中文進行搜尋
  const results = fuse.search(text);
  if (results.length === 0) return ["pop"];

  return results[0].item.tags;
}
