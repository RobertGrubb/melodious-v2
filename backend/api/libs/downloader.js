const ffmpeg = require("fluent-ffmpeg");
const ytdl = require("ytdl-core");
const request = require("request");
const shortid = require('shortid');
const youtube = require('./youtube');

const apiUrl = 'https://www.googleapis.com/youtube/v3';

class downloader {

  constructor(options) {
    this.fileSavePath = options.fileSavePath;
    this.ffmpegPath = options.ffmpegPath;
    this.apiKey = options.apiKey;
  }

  download(data, callback) {
    const url = `${apiUrl}/videos?part=id,snippet,contentDetails&id=${data.videoId}&key=${this.apiKey}`;
    ffmpeg.setFfmpegPath(this.ffmpegPath);

    request(url, { json: true }, (error, res) => {
      if (error) callback(error);

      let id = shortid.generate();
      let videoTitle = res.body.items[0].snippet.title;
      let videoThumbnail = res.body.items[0].snippet.thumbnails.default.url;
      let duration = res.body.items[0].contentDetails.duration;
      let savedFileName =  `${id}.mp3`;
      let trackInfo = {}

      let youtubeDownloadUrl = "http://www.youtube.com/watch?v=" + data.videoId;
      ytdl.getInfo(youtubeDownloadUrl, (error, info) => {
        if (error) return callback(error);

        let downloadedVideo = ytdl.downloadFromInfo(info);
        downloadedVideo.on('response', () => {
          const converter = new ffmpeg({ source: downloadedVideo });

          converter.withAudioCodec('libmp3lame');
          converter.toFormat('mp3');
          converter.saveToFile(this.fileSavePath + savedFileName);

          converter.on('error', errorLog => {
            console.log(errorLog);
            callback(errorLog);
          })
          converter.on('start', startCommandLog => console.log(startCommandLog));

          converter.on('end', () => {
            trackInfo.id = id;
            trackInfo.title = data.title || videoTitle;
            trackInfo.fileName = savedFileName;
            trackInfo.artist = data.artist || 'Unknown';
            trackInfo.artistUrl = '';
            trackInfo.album = data.album || 'None';
            trackInfo.genre = data.genre || 'None';
            trackInfo.mood = 'None';
            trackInfo.duration = youtube.convertTime(duration);
            return callback(false, trackInfo)
          })
        })
      });
    });
  }
}

module.exports = downloader;
