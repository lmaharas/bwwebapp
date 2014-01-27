(function($, undefined) {
    "use strict";

    var currentState = 'forecast',
        touchOrClickEvent = Modernizr.touch ? "touchstart" : "click";

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

                if ( path == 'addnote') {
                    bindAddNoteEvents();
                } else {
                    bindEvents();
                }
            });
        });
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

    }

    function storePic(date, picture, $pageWrapperClass, callback) {
        console.log(picture);
        hideError($pageWrapperClass);
        localStorage['picNote_' + date] = picture;
        callback();
    }

    function storeNote(date, textNote, $pageWrapperClass) {
        console.log(textNote);
        hideError($pageWrapperClass);
        localStorage['textNote_' + date] = textNote;
    }

    function showNullNoteError($pageWrapperClass) {
        $pageWrapperClass.find('.error.no-note').show();
    }

    function showStorageError($pageWrapperClass) {
        $pageWrapperClass.find('.error.no-storage').show();
    }

    function hideError($pageWrapperClass) {
        $pageWrapperClass.find('.error').hide();
    }

    function storeData() {
        var $pageWrapperClass = $('.addnote');

        if (Modernizr.localstorage) {

            var textNote = $('.addnote .note').val() ? $('.addnote .note').val() : '',
                picture = $('.addnote .gif .img').attr('src') ? $('.addnote .gif .img').attr('src') : '',
                date = new Date();

            if (textNote) {
                storeNote(date, textNote, $pageWrapperClass);
            }

            if (picture) {
                storePic(date, picture, $pageWrapperClass, function(){
                    var URL=window.URL|| window.webkitURL;
                    URL.revokeObjectURL(picture);
                });
            }

            if ( textNote === '' && picture === '' ) {
                showNullNoteError($pageWrapperClass);
            }

        } else {
            showNoStorageError($pageWrapperClass);
        }
    }

    function getCurrentPonchoMessage() {
        var ponchoJsonURL = 'http://poncho.is/s/5EcpV/json/',
            d = new Date(),
            m_names = new Array("Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."),
            curr_date = d.getDate(),
            curr_month = d.getMonth(),
            curr_year = d.getFullYear(),
            dateToday = m_names[curr_month] + " " + d_names[curr_day] + ", " + curr_year;


        $.getJSON(ponchoJsonURL, function(data){
            console.log(data[dateToday]);
        });
    }

    function getCurrentForecastCondition() {
        var LATITUDE = '40.7366138',
            LONGITUDE = '-74.0094471',
            APIKEY = '04e2a312ccb44bb2c4cc196f41a681bc',
            TIME =
            forecastIOURL = 'https://api.forecast.io/forecast/' + APIKEY + '/' + LATITUDE + ',' + LONGITUDE + ',' + TIME;


        $.getJSON(forecastIOURL, function(data){

        });
    }

    function bindAddNoteEvents() {

        // open camera
        $('.camera-btn').on(touchOrClickEvent, function() {
            $('#camera').click();

            $('#camera').on('change', function(e) {
                var picture=e.target.files[0];
                loadPic(picture);
            });
        });

        // scroll to text input for note
        $('.wrapper .note').on('focus', function() {
            $('html, body').animate({
                scrollTop: $(this).offset().top
            });
        });

        // do not submit data form
        $('#store-data').submit( function(e) {
            e.preventDefault();
        });

        // store data locally
        $('.store-note').on(touchOrClickEvent, function(e) {
            e.preventDefault();
            storeData();
        });

        // Toggle Temp Up/Down
        $('.temps').on(touchOrClickEvent, function() {
            $('.more').animate({ height: "toggle" });
        });

        $('.back-btn').on(touchOrClickEvent, function(e) {
            e.preventDefault();
            window.history.back();
        });

    }

    function bindEvents() {

        // Toggle Temp Up/Down
        $('.temps').on(touchOrClickEvent, function() {
            $('.more').animate({ height: "toggle" });
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