import extractKeywordsFromText from "../utils/keyword-fuse.js";
import { translateToChinese } from "../utils/translate.js";
import { searchTracks } from "../services/spotify.js";
import { createSongCarousel } from "../templates/songCarousel.js";

const recommendHandler = async (event) => {
  const userInput = event.message.text.trim();

  const translatedText = await translateToChinese(userInput); // ✅ 翻譯成中文
  const keywords = extractKeywordsFromText(translatedText);
  const query = keywords.join(" ");

  const tracks = await searchTracks(query);

  if (tracks.length === 0) {
    await event.reply([
      { type: "text", text: "找不到符合的歌曲，試試其他情緒或風格描述吧！" },
      {
        type: "text",
        text: "試試這些？\n\n❤️ 戀愛\n😢 失戀\n🔥 生氣\n😌 放鬆\n🎉 興奮",
      },
    ]);
    return;
  }

  const flexMessage = createSongCarousel(
    tracks,
    "為你推薦的 Spotify 歌曲",
    "recommend"
  );
  await event.reply(flexMessage);
};

export default recommendHandler;
