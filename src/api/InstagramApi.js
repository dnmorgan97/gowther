import * as AuthSession from 'expo-auth-session';

class InstagramApi {
  //8c9c37baf3416c58d78e1c51116d4255
  IG_USERNAME = "";
  IG_PASSWORD = "";
  token = null;
  accessToken = undefined;
  result;
  state = {
    creds: [],
    token: "",
    userData: []
  }

  constructor() {

  }

  async setUserData(key, value) {
    this.state.userData[key] = value;
  }
  async getUserData(key) {
    if (key in this.state.userData) {
      return this.state.userData[key]
    }
    return false;
  }

  getInstagramAppId() {
    return "710083259607437";
  }

  setToken(result) {
    this.token = result;
  }

  getToken() {
    this.token;
  }

  setAccessToken(result) {
    this.accessToken = result;
  }

  async getMe() {
    //https://graph.instagram.com/me
  }

  async getTokens() {
    var instagram_App_id = this.getInstagramAppId();
    const redirectUrl = AuthSession.getRedirectUrl();

    var authenticationCode = await AuthSession.startAsync(
      {
        authUrl:
          `https://api.instagram.com/oauth/authorize/?client_id=${instagram_App_id}` +
          `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
          `&response_type=code` +
          `&scope=user_profile`
      }
    );

    this.setToken(authenticationCode);

    const accessToken = await this.getAccessToken();
    alert(JSON.stringify(accessToken));
    this.setAccessToken(accessToken);

    await this.setUserData('accessToken', accessToken);
    await this.setUserData('authenticationCode', authenticationCode);


  }
  getCode() {
    return this.token.result.params.code;
  }

  async getAccessToken() {
    var instagram_App_id = this.getInstagramAppId();
    const redirectUrl = AuthSession.getRedirectUrl();

    const code = this.getCode();

    const response = await fetch("https://api.instagram.com/oauth/access_token", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `client_id=${instagram_App_id}&client_secret=8c9c37baf3416c58d78e1c51116d4255&grant_type=authorization_code&redirect_uri=${redirectUrl}&code=${code}`
    });

    const responseJson = await response.json();
    alert(JSON.stringify(responseJson));
    return responseJson.items;
  }
}

export default InstagramApi;
