(function($, undefined) {
    "use strict";

    var currentState = 'forecast',
        touchOrClickEvent = Modernizr.touch ? "touchstart" : "click",
        modalOpen = true,
        consolidated_json,
        weatherTodayCondition = '',
        weatherCurrentTemp = '',
        weatherData = [],
        weatherType = '',
        forecastToday = '';

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
        if (hash == 'addnote' && modalOpen) {
            openModal('addnote');
        }
        if (hash == 'wear' && modalOpen) {
            //openModal('wear');
        }
    }

    function openModal(id) {
        var modalId = id + '-modal';

        $('#' + modalId).modal('show');

        if (id === 'addnote') {
            modalOpen = false;
        }

    }

    //TODO: test this on iphone
    function hideUrlBar() {
        /mobile/i.test(navigator.userAgent) && setTimeout(function () {
            window.scrollTo(0, 1);
        }, 1000);
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

            if ( hash === headersTitle) {
                $(header).show();
            }
        });
    }

    function setBodyClass(pageClass) {
        $("body").removeClass();
        $("body").addClass(pageClass);
    }

    function loadPic(file, callback) {
        var URL=window.URL|| window.webkitURL,
            fileURL=URL.createObjectURL(file),
            gifDiv = $('.wrapper').find('.gif');

        if ( !gifDiv.length ) {

            var img = new Image();

            img.src = fileURL;
            img.className = 'img';
            $('.camera-btn').closest('.wrapper').prepend("<div class='gif'></div>");
            $('.wrapper').find('.gif').prepend(img);

        } else {

            gifDiv.find('.img').attr('src', fileURL);

        }

        callback = callback();

    }

    function storePic(date, picture, $pageWrapperClass, currTemp, currCondition, callback) {
        hideError($pageWrapperClass);
        localStorage['note_' + currCondition + '_' + currTemp + '_pict' + '_' + date] = picture;
        callback = callback();
    }

    function storeNote(date, textNote, $pageWrapperClass, currTemp, currCondition) {
        hideError($pageWrapperClass);
        localStorage['note_' + currCondition + '_' + currTemp + '_text' + '_' + date] = textNote;
    }

    function showError($pageWrapperClass, errorText, errorClass) {
        $pageWrapperClass.find('.error').addClass('.no-' + errorClass).html(errorText);
        $pageWrapperClass.find('.error').addClass('.no-' + errorClass).fadeIn( 300, function() {
            $(this).css('opacity', 1);
        });
    }

    function hideError($pageWrapperClass) {
        $pageWrapperClass.find('.error').fadeOut();
    }

    function storeUserGenData() {
        var $pageWrapperClass = $('.addnote'),
            textNote = $('.addnote .note').val() ? $('.addnote .note').val() : '',
            picture = $('.addnote .gif .img').attr('src') ? $('.addnote .gif .img').attr('src') : '',
            currTemp = $('.temps .current .weather').html(),
            currCondition = $('.temps .current .condition').attr('alt'),
            d = new Date(),
            dateNow = Date.now(),
            errorNoNote = "Please add an image or text",
            errorNoStorage = "Oops! Your browser won't allow a note to be stored. Please use Chrome or Safari.";

        if (Modernizr.localstorage) {

            if ( textNote === '' && picture === '' ) {
                //show an error
                showError($pageWrapperClass, errorNoNote, 'note');

            } else {
                // store the note
                if (textNote) {
                    storeNote(dateNow, textNote, $pageWrapperClass, currTemp, currCondition);
                }

                // store and display the pic then remove the image object url
                if (picture) {
                    storePic(dateNow, picture, $pageWrapperClass, currTemp, currCondition, function(){
                        var URL=window.URL|| window.webkitURL;
                        URL.revokeObjectURL(picture);
                    });
                }

                // finish by animating to the top of screen
                $('html, body').animate({ scrollTop: 0 }, 500, 'swing', function() {
                    openModal('saved');
                });
            }

        } else {
            //show an error
            showError($pageWrapperClass, errorNoStorage, 'storage');
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

    function setNoteFocus() {
        setTimeout(function () {
            $('.addnote .note').focus();
        }, 1500);
    }

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

    // Preprocess Data
    function preprocessTodayWeatherData(data){
        $.each(data, function (k, currData) {
            //currData.condition is found in http://poncho.is/s/i4R69/json/ as data.condition
            if (currData.condition !== 'undefined' && currData.condition) {
                forecastToday = currData;
                weatherTodayCondition = currData.condition.toLowerCase();
                weatherCurrentTemp = currData.temp2;
            } else {
                // condData.type is found in data.json as weather[i].type
                $.each(currData, function(j, condData) {
                    if (condData.type !== 'undefined' && condData.type) {
                        weatherData.push(condData);
                    }
                });
            }
        });
    }

    // Get Stored Data if conditions match
    function getLocallyStoredData(currentCond, currentTemp) {
        var localData = [];

        if (typeof(Storage)!=="undefined") {
            localData = localStorage;
            console.log(localData);
            getMatchingStoredDatatoCurrentData(localData, currentCond, currentTemp);
        }
    }

    function getMatchingStoredDatatoCurrentData(localData, currentCond, currentTemp) {
        var noteKeys = [];

        // get all the locally stored keys
        for (var i = 0; i < localData.length; i++){
            noteKeys.push(localData.key(i));
        }

        // get all sotred keys that match currentCond
        for (var key in noteKeys) {
            if (typeof noteKeys[key] !== 'function') {
                // split the key into parts
                var separator = '_',
                    parts = noteKeys[key].split(separator),
                    storedKey = key;
                    console.log(parts);

                // iterate over the parts
                for (var part in parts) {
                    if (typeof parts[part] !== 'function') {
                        // does this key match the current condition?
                        if (parts[part] == currentCond) {
                            console.log(localData[storedKey]);
                        }
                    }
                }
            }
        }

    }

    function getData() {
        var urls = ['data.json','http://poncho.is/s/i4R69/json/'],
            jxhr = [];

        $.each(urls, function (i, url) {
            jxhr.push(
                $.getJSON(url, function (data) {

                    //preprocess today's weather data
                    preprocessTodayWeatherData(data);

                    if (i === 0){
                        consolidated_json = dust.makeBase(data);
                    } else {
                        consolidated_json = consolidated_json.push({forecast: data.data});
                    }

                })
            );
        });

        $.when.apply($, jxhr).done(function() {

            for (var i = 0; i < weatherData.length; i++) {

                // compare the weatherTodayCondition string and with weatherData array on type
                // both varaibles are set in preprocessTodayWeatherData()
                if (weatherTodayCondition === weatherData[i].type) {
                    // add TodayWeatherData: type, condition, comment to json object
                    consolidated_json = consolidated_json.push({todayWeatherData: [ weatherData[i] ]});

                    // both varaibles are set in preprocessTodayWeatherData()
                    getLocallyStoredData(weatherTodayCondition, weatherCurrentTemp);

                    // consolidated_json = consolidated_json.push({forecast.day:  })
                }
            }

            console.log(consolidated_json);
            renderTemplates(currentState);
        });

    }

    function bindAddNoteEvents() {
        // open camera
        $('.camera-btn').on(touchOrClickEvent, function() {
            $('#camera').click();

            $('#camera').on('change', function(e) {
                var picture=e.target.files[0];
                loadPic(picture, function(){
                    setNoteFocus();
                });
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

        $('#saved-modal').on('shown', function() {
            //TODO: check to see this is working
            setTimeout(function () {
                console.log('this ' + $(this));
                $(this).modal('hide');
            }, 4000);
        });

        // Set Hashchange trigger
        $(window).on('hashchange', function() {
            renderTemplates(window.location.hash.substr(1));
        });

    }

    function bindEvents() {
        // Nav change hash
        $('.nav a').on(touchOrClickEvent, function(e){
            e.preventDefault();
            window.location.hash = $(this).attr('href');
        });

        // Toggle Temp Up/Down
        $('.temps').on(touchOrClickEvent, function() {
            $('.more').animate({ height: "toggle" });
        });

        // Add Button on "remember" page
        $('.add-btn').on(touchOrClickEvent, function(e) {
            e.preventDefault();
            $('.wear-page').fadeOut(400, function() {
                history.pushState(null, null, "#addnote");
                renderTemplates(window.location.hash.substr(1));
            });
        });

        // Back Button on "add a note" page
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
        hideUrlBar();
        getData();
    }

    $(document).ready(function() {
        loadBody();
    });


})(jQuery);