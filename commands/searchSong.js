import { searchTracks } from "../services/spotify.js";

function formatDuration(ms) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  return `${min}:${sec}`;
}

const searchHandler = async (event) => {
  const query = event.message.text.trim();
  const tracks = await searchTracks(query);

  if (!tracks.length) {
    await event.reply("找不到相關的歌曲，請試著修改歌名。");
    return;
  }

  const bubbles = tracks.slice(0, 5).map((track) => ({
    type: "bubble",
    hero: {
      type: "image",
      url: track.image,
      size: "full",
      aspectRatio: "1:1",
      aspectMode: "cover",
    },
    body: {
      type: "box",
      layout: "vertical",
      spacing: "md",
      contents: [
        {
          type: "text",
          text: `🎵 ${track.name}`,
          weight: "bold",
          size: "md",
          wrap: true,
          color: "#1DB954",
        },
        {
          type: "text",
          text: `👤 ${track.artist}`,
          size: "sm",
          color: "#666666",
          wrap: true,
        },
        {
          type: "text",
          text: `⏱️ ${formatDuration(track.duration)}`,
          size: "sm",
          color: "#999999",
        },
      ],
    },
    footer: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "button",
          style: "primary",
          color: "#1DB954",
          action: {
            type: "uri",
            label: "🎧 播放",
            uri: track.url,
          },
        },
        {
          type: "button",
          style: "secondary",
          color: "#aaaaaa",
          action: {
            type: "postback",
            label: "🔎 歌手介紹",
            data: `action=wikiArtist&artist=${encodeURIComponent(track.artist)}`,
            displayText: `查詢 ${track.artist} 的介紹`,
          },
        },
      ],
    },
  }));

  await event.reply({
    type: "flex",
    altText: "搜尋結果 - 相似歌曲",
    contents: {
      type: "carousel",
      contents: bubbles,
    },
  });
};

export default searchHandler;
