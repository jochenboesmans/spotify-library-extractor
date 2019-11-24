(function() {
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  function tracksButtonClickHandler() {
    const allTracks = [];
    const callbackFunction = function(parsedBody, status) {
      if (status === "success") {
        const tracks = parsedBody.items.map(item => ({
          added_at: item.added_at,
          track: {
            name: item.track.name,
            artists: item.track.artists.map(a => ({
              name: a.name,
              type: a.type,
            })),
            album: {
              name: item.track.album.name,
              release_date: item.track.album.release_date,
              type: item.track.album.type,
            },
            disc_number: item.track.disc_number,
            duration_ms: item.track.duration_ms,
            explicit: item.track.explicit,
            external_ids: item.track.external_ids,
            track_number: item.track.track_number,
            type: item.track.type,
          }
        }));

        const statusText = `Received ${Math.min(parsedBody.offset + parsedBody.limit, parsedBody.total)}/${parsedBody.total} tracks`;

        allTracks.push(tracks);
        const stringifiedTracks = JSON.stringify(allTracks);
        const blob = new Blob([stringifiedTracks], {type: "application/json"});
        const href = URL.createObjectURL(blob);
        tracksPlaceholder.innerHTML = tracksTemplate({library: JSON.stringify(allTracks), href: href, statusText: statusText});

        if (parsedBody.next && parsedBody.next !== "") {
          $.ajax({
            url: parsedBody.next,
            headers: { 'Authorization': 'Bearer ' + access_token },
            success: callbackFunction
          });
        }
      }
    }
    $.ajax({
      url: 'https://api.spotify.com/v1/me/tracks?limit=50&offset=0',
      headers: { 'Authorization': 'Bearer ' + access_token },
      success: callbackFunction
    });
  }

  function albumsButtonClickHandler() {
    const allAlbums = [];
    const callbackFunction = function(parsedBody, status) {
      if (status === "success") {
        const albums = parsedBody.items.map(item => ({
          added_at: item.added_at,
          album: {
            album_type: item.album.album_type,
            artists: item.album.artists.map(a => ({
              name: a.name,
              type: a.type,
            })),
            external_ids: item.album.external_ids,
            name: item.album.name,
            release_date: item.album.release_date,
          }
        }));

        const statusText = `Received ${Math.min(parsedBody.offset + parsedBody.limit, parsedBody.total)}/${parsedBody.total} albums`;

        allAlbums.push(albums);
        const stringifiedAlbums = JSON.stringify(allAlbums);
        const blob = new Blob([stringifiedAlbums], {type: "application/json"});
        const href = URL.createObjectURL(blob);
        albumsPlaceholder.innerHTML = albumsTemplate({library: JSON.stringify(allAlbums), href: href, statusText: statusText});

        if (parsedBody.next && parsedBody.next !== "") {
          $.ajax({
            url: parsedBody.next,
            headers: { 'Authorization': 'Bearer ' + access_token },
            success: callbackFunction
          });
        }
      }
    }
    $.ajax({
      url: 'https://api.spotify.com/v1/me/albums?limit=50&offset=0',
      headers: { 'Authorization': 'Bearer ' + access_token },
      success: callbackFunction
    });
  }

  function obtainNewTokenClickHandler() {
    $.ajax({
      url: '/refresh_token',
      data: {
        'refresh_token': refresh_token
      }
    }).done(function(data) {
      access_token = data.access_token;
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      });
    });
  }

  var userProfileSource = document.getElementById('user-profile-template').innerHTML,
      userProfileTemplate = Handlebars.compile(userProfileSource),
      userProfilePlaceholder = document.getElementById('user-profile');

  var tracksSource = document.getElementById('tracks-template').innerHTML,
      tracksTemplate = Handlebars.compile(tracksSource),
      tracksPlaceholder = document.getElementById('tracks');

  var albumsSource = document.getElementById('albums-template').innerHTML,
      albumsTemplate = Handlebars.compile(albumsSource),
      albumsPlaceholder = document.getElementById('albums');

  var params = getHashParams();

  var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {
      $('#login').hide();
      $('#loggedin').show();

      $.ajax({
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          success: function(response) {
            userProfilePlaceholder.innerHTML = userProfileTemplate(response);
          }
        });

    } else {
        // render initial screen
        $('#login').show();
        $('#loggedin').hide();
    }

    document.getElementById('request-tracks-button').addEventListener('click', tracksButtonClickHandler);
    document.getElementById('request-albums-button').addEventListener('click', albumsButtonClickHandler);
    document.getElementById('obtain-new-token').addEventListener('click', obtainNewTokenClickHandler, false);
  }
})();
