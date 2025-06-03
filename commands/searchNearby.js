import fetch from "node-fetch";

export default async function searchNearby(event) {
  if (event.message.type !== "location") return false;

  const { latitude, longitude } = event.message;
  const radius = 1000;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  // 如果是「隨便」就不加 keyword 參數
  const keywordParam =
    event.keyword && event.keyword !== "隨便"
      ? `&keyword=${encodeURIComponent(event.keyword)}`
      : "";

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1000&type=restaurant&language=zh-TW&key=${apiKey}${keywordParam}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    await event.reply("附近好像沒找到餐廳欸 🤔 換個地點看看吧！");
    return true;
  }

  // 最多取 5 筆
  const top5 = data.results.slice(0, 5);

  // 轉成 Flex Bubble 格式
  const bubbles = top5.map((place) => {
    const name = place.name;
    const address = place.vicinity || "地址不詳";
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${place.place_id}`;
    const rating = place.rating ? `⭐ ${place.rating}` : "";
    const photoRef = place.photos?.[0]?.photo_reference;
    const photoUrl = photoRef
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${photoRef}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      : null;

    return {
      type: "bubble",
      size: "mega",
      ...(photoUrl && {
        hero: {
          type: "image",
          url: photoUrl,
          size: "full",
          aspectRatio: "20:13",
          aspectMode: "cover",
        },
      }),
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: name,
            weight: "bold",
            size: "lg",
            wrap: true,
          },
          {
            type: "box",
            layout: "baseline",
            spacing: "sm",
            contents: [
              {
                type: "text",
                text: "地址",
                color: "#aaaaaa",
                size: "sm",
                flex: 1,
              },
              {
                type: "text",
                text: address,
                wrap: true,
                color: "#666666",
                size: "sm",
                flex: 5,
              },
            ],
          },
          rating
            ? {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "評分",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1,
                  },
                  {
                    type: "text",
                    text: rating,
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 5,
                  },
                ],
              }
            : null,
        ].filter(Boolean),
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          {
            type: "button",
            style: "link",
            height: "sm",
            action: {
              type: "uri",
              label: "查看地圖",
              uri: mapUrl,
            },
          },
        ],
        flex: 0,
      },
    };
  });

  // 根據是否有指定類型調整回覆訊息
  const messageText =
    event.keyword && event.keyword !== "隨便"
      ? `附近的「${event.keyword}」餐廳推薦`
      : "附近餐廳推薦";

  const flexMessage = {
    type: "flex",
    altText: messageText,
    contents: {
      type: "carousel",
      contents: bubbles,
    },
  };

  await event.reply(flexMessage);
  return true;
}
