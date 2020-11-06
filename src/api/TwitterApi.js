import { encode as btoa } from 'base-64';
import * as AuthSession from 'expo-auth-session';

const apiBase = "https://api.spotify.com/v1/";

class TwitterApi {
  state = {
    creds: [],
    token: "",
    userData: []
  }
  sp = null;

  constructor() {

  }

  async getFeed(hashtags) {
    //graph.facebook.com/ig_hashtag_search?user_id=17841405309211844&q=coke
    

    const response = await fetch('https://graph.facebook.com/ig_hashtag_search?user_id=CG8h2xnn3V9&q=' + hashtags, {
      method: 'GET',
    });
    const responseJson = await response.json();
    const { items } = responseJson;

    return responseJson;
  }



}

export default TwitterApi;