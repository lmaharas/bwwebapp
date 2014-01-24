(function($, undefined) {
    "use strict";

    var currentState = 'forecast';

    function setURL() {
        var hash = window.location.hash ? window.location.hash.substr(1) : currentState;
        window.location.hash = hash;
        setActiveNav(hash);
        setBodyClass(hash);
    }

    function setActiveNav(path) {
        $('.nav a').parent().removeClass('active');
        $('.nav a[href=#' + path + ']').parent().addClass('active');
    }

    function setBodyClass(pageClass) {
        $("body").addClass(pageClass);
    }

    function renderTemplate(path) {
        $.getJSON("data.json", function(data){
            dust.render(path, data, function(err, out) {
                $("body").html(out);
                setURL();
            });
        });
    }

    function bindEvents(data) {

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

            dust.render("forecast", data, function(err, out) {

                $("body").html(out);

                bindEvents(data);
                setURL();

            });

        });

    }

    $(document).ready(function() {
        loadBody();
    });


})(jQuery);