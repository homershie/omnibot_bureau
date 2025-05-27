import dotenv from "dotenv";
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

export async function authorizeSpotify() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body["access_token"]);
    console.log(data.body["access_token"]);
    console.log("✅ Token 取得成功");
  } catch (err) {
    console.error("❌ Token 取得失敗", err);
  }
}

export async function searchTracks(keyword) {
  try {
    const res = await spotifyApi.searchTracks(keyword, { limit: 5 });
    const tracks = res.body.tracks.items;

    return tracks.map((track) => ({
      name: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      url: track.external_urls.spotify,
      image: track.album.images[0]?.url || "",
      duration: track.duration_ms,
    }));
  } catch (err) {
    console.error("❌ 搜尋歌曲失敗", err);
    return [];
  }
}
