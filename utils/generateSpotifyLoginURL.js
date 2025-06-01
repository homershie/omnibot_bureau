import querystring from "querystring";

const generateSpotifyLoginURL = () => {
  const scopes = [
    "user-read-playback-state",
    "user-modify-playback-state",
    "playlist-modify-public",
  ];
  const params = querystring.stringify({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scopes.join(" "),
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    state: "somerandomstate",
  });
  return `https://accounts.spotify.com/authorize?${params}`;
};

export default generateSpotifyLoginURL;
