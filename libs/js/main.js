(function($, undefined) {
    "use strict";

    var currentState = 'forecast';

    function getURL() {
        var hash = window.location.hash ? window.location.hash.substr(1) : currentState;
        if (hash == 'forecast' || hash == 'wear') {
            currentState = hash;
        } else {
            currentState = 'forecast';
        }
    }

    function setURL(hash) {
        window.location.hash = hash;

        setActiveNav(hash);
        setBodyClass(hash);
    }

    function setActiveNav(path) {
        $('.nav a').parent().removeClass('active');
        $('.nav a[href=#' + path + ']').parent().addClass('active');
    }

    function setBodyClass(pageClass) {
        $("body").removeClass();
        $("body").addClass(pageClass);
    }

    function renderTemplate(path) {
        $.getJSON("data.json", function(data){
            dust.render(path, data, function(err, out) {
                $("body").html(out);
                setURL(path);
            });
        });
    }

    // function storePicture() {
    //     //localStorage.dataToStore =
    // }

    function bindEvents() {

        var touchOrClickEvent = Modernizr.touch ? "touchstart" : "click";

        // Toggle Temp Up/Down
        $('.temps').on(touchOrClickEvent, function() {
            $('.more').animate({ height: "toggle" });
        });

        // Set Hashchange trigger
        $(window).on('hashchange', function(){
            renderTemplate(window.location.hash.substr(1));
        });

    }

    function loadBody() {

        $.getJSON("data.json", function(data){

            getURL();

            dust.render(currentState, data, function(err, out) {
                $("body").html(out);
                bindEvents();
                setURL(currentState);
            });

        });

    }

    $(document).ready(function() {
        loadBody();
    });


})(jQuery);