import { getUserState, clearUserState } from "../utils/context.js";
import { createRestaurantCarousel } from "../templates/restaurantCarousel.js";

export default async function searchNearby(
  event,
  latitude = null,
  longitude = null
) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  let lat,
    lng,
    keyword = "餐廳";

  // 如果有傳入座標參數，直接使用
  if (latitude && longitude) {
    lat = latitude;
    lng = longitude;

    // 從用戶狀態取得餐廳類型
    const userState = getUserState(event.source.userId);
    if (userState?.wantType) {
      keyword = userState.wantType;
      clearUserState(event.source.userId);
    }
  }
  // 否則從 location 訊息取得
  else if (event.message.type === "location") {
    lat = event.message.latitude;
    lng = event.message.longitude;
    keyword = event.keyword || "餐廳";
  } else {
    return false;
  }

  // ...rest of the code remains the same...
  const keywordParam =
    keyword && keyword !== "隨便"
      ? `&keyword=${encodeURIComponent(keyword)}`
      : "";

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1000&type=restaurant&language=zh-TW&key=${apiKey}${keywordParam}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    await event.reply("附近好像沒找到餐廳欸 🤔 換個地點看看吧！");
    return true;
  }
  // 最多取 5 筆
  const top5 = data.results.slice(0, 5);

  // 使用模板創建餐廳輪播
  const flexMessage = createRestaurantCarousel(top5, keyword);
  await event.reply(flexMessage);
  return true;
}
