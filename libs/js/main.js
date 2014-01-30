(function($, undefined) {
    "use strict";

    var currentState = 'forecast',
        touchOrClickEvent = Modernizr.touch ? "touchstart" : "click",
        consolidated_json;

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
        setHeader(hash);
    }

    function setActiveNav(path) {
        $('.nav a').parent().removeClass('active');
        if (path !== 'addnote'){
            $('.nav a[href=#' + path + ']').parent().addClass('active');
        } else {
            $('.nav a[href=#wear]').parent().addClass('active');
        }
    }

    function setHeader(hash){
        var headers = $('.header .title');

        $.each( headers, function(k, v){
            var header = headers[k],
                headersTitle = $(header).data('title');

            if ( hash !== headersTitle) {
                $(header).hide();
            }
        });
    }

    function setBodyClass(pageClass) {
        $("body").removeClass();
        $("body").addClass(pageClass);
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
        hideError($pageWrapperClass);
        localStorage['picNote_' + date] = picture;
        callback();
    }

    function storeNote(date, textNote, $pageWrapperClass) {
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

    function storeUserGenData() {
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

    // function getForecastCondition(date) {
    //     var LATITUDE = '40.7366138',
    //         LONGITUDE = '-74.0094471',
    //         APIKEY = '04e2a312ccb44bb2c4cc196f41a681bc',
    //         TIME = date.getTime(),
    //         forecastIOURL = 'https://api.forecast.io/forecast/' + APIKEY + '/' + LATITUDE + ',' + LONGITUDE + ',' + TIME;


    //     $.getJSON(forecastIOURL, function(data){
    //         console.log(data[forecastIOURL]);
    //     });
    // }

    function renderTemplates(currentState){
        dust.render(currentState, consolidated_json, function(err, out) {

            $("body").html(out);
            $(".page-body").hide().fadeIn();

            setURL(currentState);

            if ( currentState === 'addnote') {
                bindAddNoteEvents();
            } else {
                bindEvents();
            }
        });
    }

    function getData() {
        var urls = ['data.json','http://poncho.is/s/i4R69/json/'];

        var jxhr = [];
        $.each(urls, function (i, url) {
            jxhr.push(
                $.getJSON(url, function (data) {
                    if (i === 0){
                        consolidated_json = dust.makeBase(data);
                    } else {
                        consolidated_json = consolidated_json.push({forecast: data.data});
            console.log(consolidated_json);
                    }
                })
            );
        });

        $.when.apply($, jxhr).done(function() {
            renderTemplates(currentState);
        });

    }

    // function getPonchoForecastData() {
    //     var d = new Date(),
    //         m_names = new Array("Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."),
    //         curr_date = d.getDate(),
    //         curr_month = d.getMonth(),
    //         curr_year = d.getFullYear(),
    //         dateToday = m_names[curr_month] + " " + curr_date + ", " + curr_year;
    // }

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
            storeUserGenData();
        });

        // Toggle Temp Up/Down
        $('.temps').on(touchOrClickEvent, function() {
            $('.more').animate({ height: "toggle" });
        });

        $('.back-btn').on(touchOrClickEvent, function(e) {
            e.preventDefault();
            window.history.back();
        });

        // Set Hashchange trigger
        $(window).on('hashchange', function() {
            renderTemplates(window.location.hash.substr(1));
        });

    }

    function bindEvents() {

        $('.nav a').on(touchOrClickEvent, function(e){
            e.preventDefault();
            window.location.hash = $(this).attr('href');
        });

        // Toggle Temp Up/Down
        $('.temps').on(touchOrClickEvent, function() {
            $('.more').animate({ height: "toggle" });
        });


        $('.add-btn').on(touchOrClickEvent, function(e) {
            e.preventDefault();
            $('.wear-page').fadeOut(400, function() {
                renderTemplates('addnote');
                history.pushState(null, null, "#addnote");
            });
        });

        $('.back-btn').on(touchOrClickEvent, function(e) {
            e.preventDefault();
            window.history.back();
        });

        // Set Hashchange trigger
        $(window).on('hashchange', function() {
            renderTemplates(window.location.hash.substr(1));
        });

    }

    function loadBody() {
        getURL();
        getData();
    }

    $(document).ready(function() {
        loadBody();
    });


})(jQuery);