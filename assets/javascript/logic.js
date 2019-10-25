var videos = [{trackId: 1,
               videoId: "MV_-P1IHr7w",
               spotifyName: "",
               youtubeName: ""},
              {trackId: 2,
               videoId: "KvYZVEzaPno",
               spotifyName: "",
               youtubeName: ""},
              {trackId: 3,
               videoId: "FbcLcSY2au4",
               spotifyName: "",
               youtubeName: ""},
              {trackId: 4,
               videoId: "0ewH5r8KZ6s",
               spotifyName: "",
               youtubeName: ""},
              {trackId: 5,
               videoId: "vyzihcRNy0Q",
               spotifyName: "",
               youtubeName: ""},
              {trackId: 6,
               videoId: "tAGnKpE4NCI",
               spotifyName: "",
               youtubeName: ""}];
var tempVideo = {trackId: 0,
                 videoId: " ",
                 spotifyName: " ",
                 youtubeName: " "};
var clearVideo = {trackId: 0,
                  videoId: "",
                  spotifyName: "",
                  youtubeName: ""};
var player, iframe;
var actualVideo = 0;
var tag;
var firstScriptTag;
var trackId;

(function () {

    //Parte del API para especificar cuál información se necesita exactamente
    var stateKey = 'spotify_auth_state';
    //para leer el querystring del callback
    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    function generateRandomString(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    var params = getHashParams();

    // pasa cuando se carga la página
    var access_token = params.access_token,
        state = params.state,
        storedState = localStorage.getItem(stateKey);

    // con este if se sabe si hubo algún problema de autenticación
    if (access_token && (state == null || state !== storedState)) {
        alert('There was an error during the authentication');
    } 
    else {
        localStorage.removeItem(stateKey);
        // con este if se sabe si se está autenticado correctamente
        if (access_token) {
            // si sí está autenticado entonces trae información del usuario
            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    $('#display_name').text(response.display_name);
                    $('#profile_image').attr('src', response.images[0].url);
                    $('#loggedIn').show();
                    $('#login-button').hide();
                }
            });
        } 
        else {
            console.log('not logged in')
            $('#login-button').show();
            $('#loggedIn').hide();
        }

        // click del botón de login, cambiar sólo client_id
        $('#login-button').on('click', function () {

            var client_id = 'e0e1b780bf694080b812b1b79f541a0a'; // Your client id
            var redirect_uri = 'http://127.0.0.1:5500/index.html'; // Your redirect uri
            var state = generateRandomString(16);

            localStorage.setItem(stateKey, state);
            var scope = 'user-read-private user-read-email';

            var url = 'https://accounts.spotify.com/authorize';
            url += '?response_type=token';
            url += '&client_id=' + encodeURIComponent(client_id);
            url += '&scope=' + encodeURIComponent(scope);
            url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
            url += '&state=' + encodeURIComponent(state);

            window.location = url;
        });

        // click del botón de get playlist, aquí se puede cambiar el API endpoint
        // y los headers para obtener diferentes resultados
        $('#get-playlists').on('click', function () {
            $.ajax({
                url: 'https://api.spotify.com/v1/me/playlists',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    console.log(response);
                    $('#playlists').empty();
                    $('#tracks').empty();
                    response.items.forEach(function (item, index) {
                        console.log(item.name);
                        var li = $("<li>");
                        var pl = $("<a>");
                        pl.attr("href","#");
                        pl.addClass("playlist-btn");
                        pl.attr("tracks_api_url", response.items[index].tracks.href)
                        pl.text(item.name);
                        li.append(pl);
                        $("#playlists").append(li);
                    })
                },
                error: function (err) {
                    console.log(err);
                }
            });

        });

        function diplayTracks() {
            $('#tracks').empty();
            var tracks = $(this).attr("tracks_api_url");
            console.log(tracks);
            $.ajax({
                url: tracks,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    console.log(response);
                    //videos = []; comentado para no agotar las busquedas en youtube
                    trackId = 1;
                    
                    response.items.forEach(function (item, index) {
                        console.log(item.name);
                        tempVideo = clearVideo;
                        var li = $("<li>");
                        var pl = $("<a>");
                        pl.attr("href","#");
                        pl.addClass("track-btn");
                        pl.attr("data-name", trackId);
                        pl.text(response.items[index].track.artists[0].name+" - "+response.items[index].track.name);
                        $("#tracks").append(pl);
                        tempVideo.trackId = trackId;
                        tempVideo.spotifyName = response.items[index].track.artists[0].name+" - "+response.items[index].track.name;
                        tempVideo.videoId = "";
                        tempVideo.youtubeName ="";
                        videos.push(tempVideo);
                        //comentado para no agotar las busquedas en youtube
                        searchSongYT(trackId,response.items[index].track.artists[0].name,response.items[index].track.name);
                        trackId++;
                        li.append(pl);
                        $('#tracks').append(li);
                    })
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
        $(document).on("click", ".playlist-btn", diplayTracks);
    }
})();

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: 590,
        width: 840,
        videoId: videos[actualVideo].videoId,
        events: {
            "onReady": onPlayerReady,
            "onStateChange": onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    player = event.target;
    iframe = $("#player");
    player.playVideo();
}

function playInFullscreen() {
    player.playVideo();
    var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
    if (requestFullScreen) {
        requestFullScreen.bind(iframe)();
    }
}

function onPlayerStateChange(event) {
    console.log("player state change: " + event.data);
    if (event.data === 0) {
        actualVideo++;
        if (actualVideo < videos.length) {
            player.loadVideoById(videos[actualVideo].videoId);
            playFullscreen();
        }
        else {
            actualVideo = 0;
            player.loadVideoById(videos[actualVideo].videoId);
            playFullscreen();
        }
    }
};

function searchSongYT(trackId_par,artist,songName){
    artist = artist.replace(/ /g, "+");
    songName = songName.replace(/ /g, "+");
    var queryURL = "https://www.googleapis.com/youtube/v3/search?part=id&q="+artist+songName+"&maxResults=1&type=video&videoEmbeddable=true&order=relevance&key=AIzaSyDWWRojZU9gERnqQNXAuPMOcIiMboMxKAM";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        if (response.items.length > 0){
            videos[trackId].youtubeName = response.items[0].snippet.title;
            videos[trackId].videoId = response.items[0].id.videoId;
            if (videos.length === 1){
                player.loadVideoById(videos[0].videoId);
            }
            console.log(videos);
        }
    });
}

$(document).ready(function () {
    $(window).scroll(function () {
        var sbar = $(window).scrollTop();
        var position = sbar * 0.7;

        $(".parallax").css({
            "background-position": "0 -" + position + "px"
        });
    });
    tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});
