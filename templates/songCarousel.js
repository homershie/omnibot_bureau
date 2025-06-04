// Spotify 歌曲輪播模板
function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function createSongBubble(track, buttonType = "recommend") {
  const bubble = {
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
            label: buttonType === "recommend" ? "🎧 前往 Spotify" : "🎧 播放",
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
  };

  return bubble;
}

export function createSongCarousel(tracks, altText, buttonType = "recommend") {
  const bubbles = tracks.map((track) => createSongBubble(track, buttonType));

  return {
    type: "flex",
    altText: altText,
    contents: {
      type: "carousel",
      contents: bubbles,
    },
  };
}
