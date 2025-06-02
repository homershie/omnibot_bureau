import { foodCategories } from "./foodCategories.js";

export default function getSearchKeyword(text) {
  for (const category of foodCategories) {
    if (category.keywords.some((k) => text.includes(k))) {
      return category.label; // 回傳單一 keyword
    }
  }
  return null;
}
