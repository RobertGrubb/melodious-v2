const axios = require('axios');
const {
  config
} = require('dotenv');
const YouTube = require('simple-youtube-api');


config();

const youtube = new YouTube(process.env.YOUTUBE_API_KEY);

const data = async (id) => {
  const videoUrl = 'https://www.youtube.com/watch?v=' + id;

  try {
    const res = await youtube.getVideo(videoUrl);
    return res;
  } catch (error) {
    return error;
  }
}

const convertTime = (duration) => {
  var a = duration.match(/\d+/g);

  if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
    a = [0, a[0], 0];
  }

  if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
    a = [a[0], 0, a[1]];
  }
  if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
    a = [a[0], 0, 0];
  }

  duration = 0;

  if (a.length == 3) {
    duration = duration + parseInt(a[0]) * 3600;
    duration = duration + parseInt(a[1]) * 60;
    duration = duration + parseInt(a[2]);
  }

  if (a.length == 2) {
    duration = duration + parseInt(a[0]) * 60;
    duration = duration + parseInt(a[1]);
  }

  if (a.length == 1) {
    duration = duration + parseInt(a[0]);
  }

  return duration
}

module.exports = {
  data,
  convertTime
}
