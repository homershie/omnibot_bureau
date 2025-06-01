import express from "express";
import SpotifyWebApi from "spotify-web-api-node";

const router = express.Router();

router.get("/callback", async (req, res) => {
  const code = req.query.code;

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  });

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);

    const access_token = data.body.access_token;
    const refresh_token = data.body.refresh_token;

    // 🔒 實際使用時你應該用 LINE 使用者 ID 對應存資料
    res.send(`
      <h2>登入成功！</h2>
      <p>access_token: ${access_token}</p>
      <p>refresh_token: ${refresh_token}</p>
    `);
  } catch (err) {
    console.error("Error during token exchange", err);
    res.status(500).send("登入失敗");
  }
});

export default router;
