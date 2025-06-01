export default async (event) => {
  await event.reply({
    type: "text",
    text: "請選擇你想使用的功能，或是直接用文字跟我聊天 👇",
    quickReply: {
      items: [
        {
          type: "action",
          action: {
            type: "message",
            text: "推薦歌曲", // 👉 觸發推薦流程
            label: "🎧 推薦歌曲",
          },
        },
        {
          type: "action",
          action: {
            type: "message",
            text: "搜尋歌曲", // 👉 觸發搜尋流程
            label: "🔍 搜尋歌曲",
          },
        },
        {
          type: "action",
          action: {
            type: "message",
            text: "搜尋成分", // 👉 觸發搜尋流程
            label: "🔍 搜尋食物成分",
          },
        },
        {
          type: "action",
          action: {
            type: "message",
            text: "萬萬可以做什麼", // 👉 回來這邊
            label: "📖 使用說明",
          },
        },
      ],
    },
  });
};
