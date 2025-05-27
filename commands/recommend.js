// commands/recommend.js
import extractKeywordsFromText from "../utils/keyword-fuse.js";
import { searchTracks } from "../services/spotify.js";

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

const recommendHandler = async (event) => {
  const userInput = event.message.text.trim();

  const keywords = extractKeywordsFromText(userInput);
  const query = keywords.join(" ");

  const tracks = await searchTracks(query);

  if (tracks.length === 0) {
    await event.reply("找不到符合的歌曲，試試其他情緒或風格描述吧！");
    return;
  }

  const bubbles = tracks.map((track) => ({
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
            label: "🎧 前往 Spotify",
            uri: track.url,
          },
        },
        {
          type: "button",
          style: "secondary",
          color: "#aaaaaa",
          action: {
            type: "postback",
            label: "📖 背景故事",
            data: `action=explain&title=${encodeURIComponent(track.name)}&artist=${encodeURIComponent(track.artist)}`,
          },
        },
      ],
    },
  }));

  await event.reply({
    type: "flex",
    altText: "為你推薦的 Spotify 歌曲",
    contents: {
      type: "carousel",
      contents: bubbles,
    },
  });
};

export default recommendHandler;
