import axios from "axios";

export async function getWikipediaSummary(title) {
  try {
    const res = await axios.get(
      `https://zh.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    );
    if (res.data.extract) {
      return res.data.extract;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}
