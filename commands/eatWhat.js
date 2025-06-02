import foodList from "../utils/foodList.js";
import getFoodTagsFromText from "../utils/getFoodTagsFromText.js";

export default function eatWhat(event) {
  const text = event.message.text.toLowerCase();
  const tags = getFoodTagsFromText(text);
  if (tags.length === 0) return false;

  const candidates = foodList.filter((item) =>
    tags.every((tag) => item.tags.includes(tag))
  );

  if (candidates.length === 0) {
    event.reply("目前找不到符合你口味的選項，換個說法或點選上面的選單試試看！");
  } else {
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    event.reply(`那就吃「${pick.name}」吧！🍽`);
  }
  return true;
}
