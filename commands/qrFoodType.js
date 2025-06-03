export default async function sendTypeSelector(event) {
  return event.reply([
    {
      type: "text",
      text: "想吃哪一類呢？🍽️（第一組）",
      quickReply: {
        items: [
          {
            type: "action",
            action: { type: "message", label: "🎲 隨便", text: "找隨便" },
          },
          {
            type: "action",
            action: { type: "message", label: "🍲 火鍋", text: "找火鍋" },
          },
          {
            type: "action",
            action: { type: "message", label: "🍱 便當", text: "找便當" },
          },
          {
            type: "action",
            action: { type: "message", label: "🍣 壽司", text: "找壽司" },
          },
          {
            type: "action",
            action: { type: "message", label: "🍥 拉麵", text: "找拉麵" },
          },
          {
            type: "action",
            action: { type: "message", label: "🍜 牛肉麵", text: "找牛肉麵" },
          },
          {
            type: "action",
            action: { type: "message", label: "🍱 泰式", text: "找泰式" },
          },
          {
            type: "action",
            action: { type: "message", label: "🥡 港式", text: "找港式" },
          },
          {
            type: "action",
            action: { type: "message", label: "🍚 熱炒", text: "找熱炒" },
          },
          {
            type: "action",
            action: { type: "message", label: "🍕 披薩", text: "找披薩" },
          },
          {
            type: "action",
            action: { type: "message", label: "🍖 燒烤", text: "找燒烤" },
          },
          {
            type: "action",
            action: { type: "message", label: "☕ 咖啡廳", text: "找咖啡廳" },
          },
          {
            type: "action",
            action: { type: "message", label: "➡️ 更多", text: "更多餐廳選項" },
          },
        ],
      },
    },
  ]);
}
