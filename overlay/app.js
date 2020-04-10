$(document).ready(function() {
  var params = getUrlVars();

  if (!params.streamer) {
    $('#track-title').html('Not available');
    $('#track-artist').html('Not available');
    $('#track-credits').html('Not available');
  } else {
    getStreamInfo(params.streamer);

    setInterval(function() {
      getStreamInfo(params.streamer);
    }, 3000)
  }
});

function getStreamInfo (username) {
  var apiUrl = 'https://api.melodious.live/api/' + username + '/stream';

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
    } else {
      $('#track-title').html('Not available');
      $('#track-artist').html('Not available');
      $('#track-credits').html('Not available');
    }
  })
  .fail(function() {
    $('#track-title').html('Not available');
    $('#track-artist').html('Not available');
    $('#track-credits').html('Not available');
  });
}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}
