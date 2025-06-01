import axios from "axios";

export default async function handlePostback(event) {
  const data = event.postback.data;
  const params = new URLSearchParams(data);
  const action = params.get("action");

  if (action === "wikiArtist") {
    const artist = params.get("artist");
    const wikiUrl = `https://zh.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(artist)}`;

    try {
      const res = await axios.get(wikiUrl);
      const page = res.data;

      if (page.extract) {
        await event.reply([
          {
            type: "text",
            text: `🔍 ${artist} 的維基百科介紹：\n\n${page.extract}`,
          },
          {
            type: "text",
            text: `👉 更多請見：${page.content_urls?.desktop?.page || "https://zh.wikipedia.org/"}`,
          },
        ]);
      } else {
        await event.reply(`找不到「${artist}」的維基百科條目 😢`);
      }
    } catch (err) {
      console.error(err);
      await event.reply("查詢失敗，請稍後再試！");
    }
  }
}
