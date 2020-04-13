import axios from 'axios';

const _proto = {

  clientId: '',
  returnUrl: '',
  scope: 'user_read',

  /**
   * Builds the auth link for twitch.
   */
  authLink() {
    let url = 'https://api.twitch.tv/kraken/oauth2/authorize?response_type=code';
    if (this.clientId) url += '&client_id=' + this.clientId;
    if (this.returnUrl) url += '&redirect_uri=' + this.returnUrl;
    if (this.scope) url += '&scope=' + this.scope + '+user_follows_edit';
    return url;
  }

};

const twitchAuthClient = Object.create(_proto);
twitchAuthClient.clientId = process.env.REACT_APP_TWITCH_CLIENT_ID;
twitchAuthClient.returnUrl = process.env.REACT_APP_TWITCH_REDIRECT_URL;

export default twitchAuthClient;
