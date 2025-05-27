import { searchTracks } from "../services/spotify.js";

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

const searchHandler = async (event) => {
  const query = event.message.text.replace("搜尋歌曲", "").trim();
  if (!query) {
    await event.reply(
      "請在「搜尋歌曲」後加上歌名，例如：搜尋歌曲 Shape of You"
    );
    return;
  }

  const result = await searchTracks(query);
  if (result.length === 0) {
    await event.reply("找不到這首歌，請試試別的名稱！");
    return;
  }

  const track = result[0];

  const flex = {
    type: "flex",
    altText: `歌曲資訊：${track.name}`,
    contents: {
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
    },
  };

  await event.reply(flex);
};

export default searchHandler;
