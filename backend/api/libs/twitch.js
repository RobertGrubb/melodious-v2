const { Promise } = require('bluebird');
const axios = require('axios');
const { config } = require('dotenv');

// Configure .env
config();

const _proto = {

	clientId: '',
	returnUrl: '',
	scope: 'user_read+user_follows_edit',

  /**
   * Get access credentials for a given
   * code returned from oauth route on Twitch.
   */
	async getAccessCredentials (code) {
    let url = 'https://id.twitch.tv/oauth2/token?';

    // Set parameters to append to the URL.
    const params = {
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: this.returnUrl,
      client_id: this.clientId,
      client_secret: this.clientSecret
    };

    // Append parameters to the URL
    url += Object.keys(params).map(key => key + '=' + params[key]).join('&');

    // Attempt to call URL and get response.
    try {
      const res = await axios.post(url);
      return res.data;
    } catch (error) {
      return { error };
    }
	},

  /**
   * Grabs user data for a given access token
   */
	async getUserData (access_token) {

    // Set URL to call
    let url = 'https://api.twitch.tv/helix/users';

    // Set headers for request
    const headers = {
      'Authorization': 'Bearer ' + access_token,
      'Client-ID': this.clientId,
      'Accept': 'application/vnd.twitchtv.v5+json'
    };

    // Attempt to call URL and get response.
    try {
      const res = await axios.get(url, { headers });
      return res.data;
    } catch (error) {
      return {error: error};
    }
	}

};

const twitchAuthClient = Object.create(_proto);

twitchAuthClient.clientId = process.env.TWITCH_CLIENT_ID;
twitchAuthClient.returnUrl = process.env.TWITCH_REDIRECT_URL;
twitchAuthClient.clientSecret = process.env.TWITCH_CLIENT_SECRET;

module.exports = twitchAuthClient;
