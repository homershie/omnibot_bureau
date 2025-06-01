import { searchWikipedia } from "../services/wikipedia.js";

const postbackHandler = async (event) => {
  const data = event.postback.data;
  const params = new URLSearchParams(data);
  const action = params.get("action");

  if (action === "wikiArtist") {
    const artist = params.get("artist");
    const result = await searchWikipedia(artist);

    if (!result) {
      await event.reply(`維基百科找不到「${artist}」的歌手介紹 QQ`);
      return;
    }

    const replyText = `📖 ${result.title}（來自 ${result.lang} 維基百科）\n\n${result.extract}\n\n🔗 ${result.url}`;
    await event.reply(replyText);
  }
};

export default postbackHandler;
