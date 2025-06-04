// 餐廳推薦輪播模板
export function createRestaurantBubble(place) {
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
}

export function createRestaurantCarousel(places, keyword) {
  const bubbles = places.map((place) => createRestaurantBubble(place));

  const messageText =
    keyword && keyword !== "隨便"
      ? `附近的「${keyword}」餐廳推薦`
      : "附近餐廳推薦";

  return {
    type: "flex",
    altText: messageText,
    contents: {
      type: "carousel",
      contents: bubbles,
    },
  };
}
