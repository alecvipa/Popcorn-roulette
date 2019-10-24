$(document).ready(function () {
    $(window).scroll(function () {
        var sbar = $(window).scrollTop();
        var position = sbar * 0.7;

        $(".parallax").css({
            "background-position": "0 -" + position + "px"
        });
    });

});

(function() {

    //Parte del API para especificar cuál información se necesita exactamente
    var stateKey = 'spotify_auth_state';

    //para leer el querystring del callback
    function getHashParams() {
      var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
          q = window.location.hash.substring(1);
      while ( e = r.exec(q)) {
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
    } else {
      localStorage.removeItem(stateKey);
      // con este if se sabe si se está autenticado correctamente
      if (access_token) {
        // si sí está autenticado entonces trae información del usuario
        $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
              $('#display_name').text(response.display_name);
              $('#profile_image').attr('src', response.images[0].url);
              $('#loggedIn').show();
              $('#login').hide();
            }
        });
      } else {
        console.log('not logged in')
        $('#login').show();
        $('#loggedIn').hide();
      }

      // click del botón de login, cambiar sólo client_id
      $('#login-button').on('click', function() {

        var client_id = '3386e3e76fed413ab42a777f6f68003e'; // Your client id
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
      $('#get-playlists').on('click',function(){
        $.ajax({
            url: 'https://api.spotify.com/v1/me/playlists',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
              console.log(response);
              response.items.forEach(function(item, index){
                console.log(item.name);
                var pl = $('<div>');
                pl.text(item.name);
                $('#playlists').append(pl);
              })
            },
            error: function(err){
              console.log(err);
            }
        });

      });
    }
  })();
  
// YOUTUBE!!!!API
var videos = ["KvYZVEzaPno", "FbcLcSY2au4", "0ewH5r8KZ6s", "vyzihcRNy0Q", "tAGnKpE4NCI"];
var player, iframe;
var $ = document.querySelector.bind(document);
var actualVideo = 0;
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: 590,
        width: 840,
        videoId: videos[actualVideo],
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

function playInFullscreen(){
    player.playVideo();
    var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
    if (requestFullScreen) {
      requestFullScreen.bind(iframe)();
    }
}

function onPlayerStateChange(event) {
    console.log("player state change: "+event.data);
    if (event.data === 0){
        actualVideo++;
        if (actualVideo < videos.length){
            player.loadVideoById(videos[actualVideo]);
            playFullscreen();
        }
        else{
            actualVideo = 0;
            player.loadVideoById(videos[actualVideo]);
            playFullscreen();
        }
    }
};

// PARALLAX!!!

$(document).ready(function () {
    $(window).scroll(function () {
        var sbar = $(window).scrollTop();
        var position = sbar * 0.7;

        $(".parallax").css({
            "background-position": "0 -" + position + "px"
        });
    });

});




  
