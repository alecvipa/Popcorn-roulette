// var settings = {
// 	"async": true,
// 	"crossDomain": true,
// 	"url": "https://unogs-unogs-v1.p.rapidapi.com/api.cgi?t=genres",
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com",
// 		"x-rapidapi-key": "0c3a869275msh2b8fb3a6ebdb214p1b7471jsncc68547fe177"
// 	}
// }

// $.ajax(settings).done(function (response) {
// 	console.log(response);
// });
var videos = ["KvYZVEzaPno", "FbcLcSY2au4", "0ewH5r8KZ6s", "vyzihcRNy0Q", "tAGnKpE4NCI"];
//Id to test locally "MV_-P1IHr7w"
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

$(document).ready(function () {
    $(window).scroll(function () {
        var sbar = $(window).scrollTop();
        var position = sbar * 0.7;

        $(".parallax").css({
            "background-position": "0 -" + position + "px"
        });
    });

});




  
