import axios from "axios";

export async function searchWikipedia(
  title,
  preferredTypes = ["音樂", "歌手", "樂團", "音樂人"]
) {
  const langs = ["zh", "en", "ja", "ko"];

  for (const lang of langs) {
    const searchUrl = `https://${lang}.wikipedia.org/w/api.php`;
    const params = {
      action: "query",
      list: "search",
      srsearch: title,
      format: "json",
      origin: "*", // 為了避免 CORS
    };

    try {
      const res = await axios.get(searchUrl, { params });
      const results = res.data.query.search;

      const matched = results.find((r) =>
        preferredTypes.some((keyword) => r.snippet.includes(keyword))
      );

      if (matched) {
        const pageTitle = matched.title;
        const summaryUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
        const summaryRes = await axios.get(summaryUrl);

        if (summaryRes.status === 200 && summaryRes.data.extract) {
          return {
            title: summaryRes.data.title,
            extract: summaryRes.data.extract,
            url: summaryRes.data.content_urls.desktop.page,
            lang,
          };
        }
      }
    } catch (err) {
      continue;
    }
  }

  return null;
}
