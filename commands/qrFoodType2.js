export default async function sendTypeSelectorMore(event) {
  return event.reply({
    type: "text",
    text: "想吃哪一類呢？🍽️（第二組）\n或是輸入【找○○】直接搜尋！",
    quickReply: {
      items: [
        {
          type: "action",
          action: { type: "message", label: "🍔 漢堡", text: "找漢堡" },
        },
        {
          type: "action",
          action: { type: "message", label: "🥘 印度菜", text: "找印度菜" },
        },
        {
          type: "action",
          action: { type: "message", label: "🍖 韓式", text: "找韓式" },
        },
        {
          type: "action",
          action: { type: "message", label: "🍝 義式", text: "找義式" },
        },
        {
          type: "action",
          action: { type: "message", label: "🥟 水餃", text: "找水餃" },
        },
        {
          type: "action",
          action: { type: "message", label: "🍜 小吃", text: "找小吃" },
        },
        {
          type: "action",
          action: { type: "message", label: "🧋 飲料店", text: "找飲料店" },
        },
        {
          type: "action",
          action: { type: "message", label: "🍰 甜點", text: "找甜點" },
        },
        {
          type: "action",
          action: { type: "message", label: "🥗 輕食", text: "找輕食" },
        },
        {
          type: "action",
          action: { type: "message", label: "🍱 健康餐", text: "找健康餐" },
        },
        {
          type: "action",
          action: {
            type: "message",
            label: "⬅️ 回到第一組",
            text: "餐廳類型第一組",
          },
        },
      ],
    },
  });
}
