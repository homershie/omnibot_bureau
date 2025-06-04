import { searchTracks } from "../services/spotify.js";
import { createSongCarousel } from "../templates/songCarousel.js";

const searchHandler = async (event) => {
  const query = event.message.text.trim();
  const tracks = await searchTracks(query);

  if (!tracks.length) {
    await event.reply("找不到相關的歌曲，請試著修改歌名。");
    return;
  }

  const topTracks = tracks.slice(0, 5);
  const flexMessage = createSongCarousel(
    topTracks,
    "搜尋結果 - 相似歌曲",
    "search"
  );
  await event.reply(flexMessage);
};

export default searchHandler;
