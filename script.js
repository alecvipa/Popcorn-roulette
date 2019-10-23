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

$(document).ready(function(){
    $(window).scroll(function(){
        var sbar = $(window).scrollTop();
        var position = sbar * 0.7;

        $(".parallax").css({
            "background-position" : "0 -" + position + "px"
        });
    });
});




  
