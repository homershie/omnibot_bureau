export default function sendFoodQuickReply(event) {
  return event.reply({
    type: "text",
    text: "想吃什麼類型呢？👇",
    quickReply: {
      items: [
        {
          type: "action",
          action: { type: "message", label: "飯", text: "想吃飯" },
        },
        {
          type: "action",
          action: { type: "message", label: "麵", text: "想吃麵" },
        },
        {
          type: "action",
          action: { type: "message", label: "湯", text: "來點湯的" },
        },
        {
          type: "action",
          action: { type: "message", label: "麵包", text: "麵包" },
        },
        {
          type: "action",
          action: { type: "message", label: "台式", text: "台式" },
        },
        {
          type: "action",
          action: { type: "message", label: "日式", text: "日式" },
        },
        {
          type: "action",
          action: { type: "message", label: "韓式", text: "韓式" },
        },
        {
          type: "action",
          action: { type: "message", label: "港式", text: "港式" },
        },
        {
          type: "action",
          action: { type: "message", label: "義式", text: "義式" },
        },
        {
          type: "action",
          action: { type: "message", label: "美式", text: "美式" },
        },
        {
          type: "action",
          action: { type: "message", label: "墨西哥", text: "墨西哥" },
        },
        {
          type: "action",
          action: { type: "message", label: "東南亞", text: "東南亞" },
        },
        {
          type: "action",
          action: { type: "message", label: "印度", text: "印度" },
        },
      ],
    },
  });
}
