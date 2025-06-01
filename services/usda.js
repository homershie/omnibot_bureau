import fetch from "node-fetch";

const USDA_API_KEY = process.env.USDA_API_KEY;
const SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

export async function searchUSDAFood(query) {
  const params = new URLSearchParams({
    query,
    api_key: USDA_API_KEY,
    pageSize: 1,
  });

  const res = await fetch(`${SEARCH_URL}?${params}`);
  const data = await res.json();
  return data.foods?.[0]; // 只取第一筆
}
