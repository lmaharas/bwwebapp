(function($, undefined) {
    "use strict";

    var currentState = 'forecast';

    function getURL() {
        var hash = window.location.hash ? window.location.hash.substr(1) : currentState;
        if (hash == 'forecast' || hash == 'wear' || hash == 'addnote') {
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
        if (path !== 'addnote'){
            $('.nav a[href=#' + path + ']').parent().addClass('active');
        } else {
            $('.nav a[href=#wear]').parent().addClass('active');
        }
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

    function storePic(picture) {
        localStorage.dataToStore = picture;
    }

    function loadPic(file) {
        var URL=window.URL|| window.webkitURL,
            fileURL=URL.createObjectURL(file),
            gifDiv = $('.wrapper').find('.gif');

        if ( !gifDiv.length ) {

            var img = new Image();

            img.src = fileURL;
            img.className = 'img';
            $('.camera-btn').parent().prepend("<div class='gif'></div>");
            $('.camera-btn').prev('.gif').prepend(img);

        } else {

            gifDiv.find('.img').attr('src', fileURL);

        }

        URL.revokeObjectURL(fileURL);
    }

    function storeNote() {
        textNote = $('.add-page .note').html();
        if(textNote !== '' || textNote === 'undefined') {
            localStorage.dataToStore = textNote;
        }
    }

    function bindEvents() {

        var touchOrClickEvent = Modernizr.touch ? "touchstart" : "click";

        // Toggle Temp Up/Down
        $('.temps').on(touchOrClickEvent, function() {
            $('.more').animate({ height: "toggle" });
        });

        $('.camera-btn').on(touchOrClickEvent, function() {
            $('#camera').click();
            console.log('camera');

            $('#camera').on('change', function(e) {
                var picture=e.target.files[0];
                console.log(picture);
                loadPic(picture);
            });
        });

        $('.store-note').on(touchOrClickEvent, function() {
            storePic();
            storeNote();
        });

        $('.add-btn').on(touchOrClickEvent, function(e) {
            e.preventDefault();
            $('.wear-page').fadeOut(400, function() {
                renderTemplate('addnote');
                history.pushState(null, null, "#addnote");
            });
        });

        $('.back-btn').on(touchOrClickEvent, function(e) {
            e.preventDefault();
            window.history.back();
        });

        // Set Hashchange trigger
        $(window).on('hashchange', function() {
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