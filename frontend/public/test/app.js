$(document).ready(function() {
  getStreamInfo('iratetv');

  setInterval(function() {
    getStreamInfo('iratetv');
  }, 3000)
});

function getStreamInfo (username) {
  var apiUrl = 'http://localhost:3007/api/' + username + '/stream';

  $.ajax({
    url: apiUrl,
    dataType: 'json'
  })
  .done(function( data ) {
    if (data.stream !== false) {
      $('#track-title').html(data.stream.title);
      $('#track-artist').html(data.stream.artist);
      var credits = data.stream.credits;
      if (!credits) return $('#track-credits').html('No credits for this track.');
      credits = credits.replace("\\n", "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
      $('#track-credits').html(credits);
    }
  });
}
