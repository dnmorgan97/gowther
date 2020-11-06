import { encode as btoa } from 'base-64';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';

  const apiBase = "https://api.spotify.com/v1/";
  const scopesArr = ['user-modify-playback-state','user-read-currently-playing','user-read-playback-state','user-library-modify',
                     'user-library-read','playlist-read-private','playlist-read-collaborative','playlist-modify-public',
                     'playlist-modify-private','user-read-recently-played','user-top-read'];
  const scopes = scopesArr.join(' ');

class SpotifyApi {
  state = {
    creds: [],
    token: "",
    userData: []
  }
  sp = null;

  constructor() {

  }

  

  getSpotifyCredentials() {
    const spotifyCredentials = {
      clientId: '7a41560975414e4dbac4aa823765d7dc',
      clientSecret: 'd4cbc50ec63a4efead2a999dedc1369c',
      redirectUri: 'https://auth.expo.io/@dnmorgan/com.gowther'
    }
    return spotifyCredentials
  }

  async setUserData(key, value) {
    await SecureStore.setItemAsync(key, value, SecureStore.ALWAYS_THIS_DEVICE_ONLY)
    .then((res) => {
        //this.state.userData[key] = value;
        console.log(res);
    }, (err) => {
        console.log(err);
    });
    
  }
  async getUserData(key) {
      // For retrieving key
    return await SecureStore.getItemAsync(key)
    .then((res) => {
        alert(res);
        return res;
    }, (err) => {
        console.log(err);
    });
    return false;
  }

  async getPlaylist(playlist) {
    const accessToken = await this.getUserData('accessToken');

    const response = await fetch("https://api.spotify.com/v1/playlists/" + playlist + "/tracks", {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    });

    const responseJson = await response.json();

    return responseJson.items;
  }

  async getMyPlaylists() {
    var accessToken = await this.getUserData('accessToken');

    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    });

    const responseJson = await response.json();

    return responseJson;
  }

  async getMe() {
    const credentials = await this.getSpotifyCredentials() //we wrote this function above
    
    var accessToken = await this.getUserData('accessToken');

    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    });
    const responseJson = await response.json();

    return responseJson;
  }

  async refreshTokens() {
    try {
      const credentials = await this.getSpotifyCredentials() //we wrote this function above

      const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
      const refreshToken = await this.getUserData('refreshToken');

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credsB64}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        await this.getTokens();
      } else {
        const {
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
          expires_in: expiresIn,
        } = responseJson;

        const expirationTime = new Date().getTime() + expiresIn * 1000;
        await this.setUserData('accessToken', newAccessToken);
        if (newRefreshToken) {
          await this.setUserData('refreshToken', newRefreshToken);
        }
        await this.setUserData('expirationTime', expirationTime);
      }
    } catch (err) {
      alert(err)
    }
  }


  async getAuthorizationCode() {
    try {
      const credentials = await this.getSpotifyCredentials() //we wrote this function above

      const redirectUrl = AuthSession.getRedirectUrl(); //this will be something like https://auth.expo.io/@your-username/your-app-slug

      const result = await AuthSession.startAsync({
        authUrl:
          'https://accounts.spotify.com/authorize' +
          '?response_type=code' +
          '&client_id=' +
          credentials.clientId +
          (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
          '&redirect_uri=' +
          encodeURIComponent(redirectUrl),
      });

      return result.params.code

    } catch (err) {
      console.error(err)
      alert(err);
    }

  }

  async getTokens() {
    try {
      const authorizationCode = await this.getAuthorizationCode() //we wrote this function above

      const credentials = await this.getSpotifyCredentials() //we wrote this function above (could also run this outside of the functions and store the credentials in local scope)
      const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credsB64}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${credentials.redirectUri}`,
      });
      const responseJson = await response.json();

      // destructure the response and rename the properties to be in camelCase to satisfy my linter ;)
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
      } = responseJson;

      const expirationTime = new Date().getTime() + expiresIn * 1000;

      await this.setUserData('accessToken', accessToken);
      await this.setUserData('refreshToken', refreshToken);
      await this.setUserData('expirationTime', expirationTime);
    } catch (err) {
      alert("Spotify API Error");
      alert(err);
      
      console.error(err);
    }
  }

}

export default SpotifyApi;