(function($, undefined) {
    "use strict";

    // gloabal vars
    var currentState = 'forecast',
        touchOrClickEvent = Modernizr.touch ? "touchstart" : "click",
        modalWearOpen = true,
        modalAddOpen = true,
        consolidated_json,
        weatherTodayCondition = '',
        weatherCurrentTemp = '',
        weatherData = [],
        weatherType = '',
        forecastToday = '',
        imgAsDataURL = '';

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
        if (hash == 'addnote' && modalAddOpen) {
            if ( localStorage.length === 0 && Modernizr.localstorage ) {
                openModal('addnote');
            }
        }
    }

    function openModal(id) {
        var modalId = id + '-modal';

        $('#' + modalId).modal('show');

        if (id === 'addnote') {
            modalAddOpen = false;
        }

    }

    //TODO: test this on iphone
    // function hideUrlBar() {
    //     /mobile/i.test(navigator.userAgent) && setTimeout(function () {
    //         window.scrollTo(0, 1);
    //     }, 1000);
    // }

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
            fileURL,
            imgDiv = $('.reminder').find('.media');

        if (typeof file === "object") {
            // this obj comes from the file that is loaded after a picture is taken
            // for the "add a note" page
            fileURL = URL.createObjectURL(file);
        } else {
            // this string comes from the stored data image blob
            // for the "remember" page
            fileURL = file;
        }

        if ( !imgDiv.length ) {

            var img = new Image();

            img.src = fileURL;
            img.className = 'img';
            $('.reminder').prepend("<div class='media'></div>");
            $('.reminder').find('.media').prepend(img);

        } else {

            imgDiv.find('.img').attr('src', fileURL);

        }

        if (callback){
            callback = callback();
        }

    }

    function storePicAndNote(currDate, formatDate, picture, text, $pageWrapperClass, currTemp, todaysCondition, callback) {
        hideError($pageWrapperClass);

        var storedName = todaysCondition + '_' + currDate,
            dataToStore = { 'condition': todaysCondition, 'currTemp': currTemp, 'date': formatDate, 'picture': picture, 'text': text };
        // Put the object into storage
        localStorage.setItem(storedName, JSON.stringify(dataToStore) );

        callback = callback();
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

    function preprocessUploadedImage(picture) {
        var imgCanvas = document.createElement("canvas"),
            imgContext = imgCanvas.getContext("2d");

        // Make sure canvas is as big as the picture
        imgCanvas.width = picture[0].width;
        imgCanvas.height = picture[0].height;

        // Draw image into canvas element
        imgContext.drawImage(picture[0], 0, 0, picture[0].width, picture[0].height);

        // Get canvas contents as a data URL
        imgAsDataURL = imgCanvas.toDataURL("image/png");
    }

    function storeUserGenData(consolidated_json) {
        var $pageWrapperClass = $('.addnote'),
            textNote = $('.addnote .note').val() ? $('.addnote .note').val() : '',
            picture = $('.addnote .media .img'),
            d = new Date(),
            dateNow = Date.now(),
            d_names = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"),
            m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"),
            curr_day = d.getDay(),
            curr_date = d.getDate(),
            curr_month = d.getMonth(),
            curr_year = d.getFullYear(),
            formatDate = d_names[curr_day] + ", " + m_names[curr_month] + " " + curr_date + ", " + curr_year,
            // formatDate =  day + " " + month + " " + date + " " + year,
            errorNoNote = "Please add an image or text",
            errorNoStorage = "Oops! Your browser won't allow a note to be stored. Please use Chrome or Safari.";
            //currLocation = consolidated_json.forecast.city;

        if ( Modernizr.localstorage ) {

            if ( textNote === '' && picture === 'undefined' ) {
                //show an error
                showError($pageWrapperClass, errorNoNote, 'note');

            } else {
                // preprocess the stored image
                if ( picture.length !== 0 ) {
                    preprocessUploadedImage(picture);
                }

                // store the note + pic
                if (textNote || picture) {
                    // store and display the pic then remove the image object url
                    storePicAndNote(dateNow, formatDate, imgAsDataURL, textNote, $pageWrapperClass, weatherCurrentTemp, weatherTodayCondition, function(){

                        // if (picture) {
                        //     var URL=window.URL|| window.webkitURL;
                        //     URL.revokeObjectURL(picture);
                        // }
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

    function setNoteFocus() {
        setTimeout(function () {
            $('.addnote .note').focus();
        }, 1000);
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
    function getLocallyStoredData(todaysCond, currentTemp, callback) {
        var localData = [];

        // get localStorage from browser
        localData = localStorage;
        getLocalKeysForCurrCond(localData, todaysCond, currentTemp, callback);
    }

    function getLocalKeysForCurrCond(localData, todaysCond, currentTemp, callback) {
        // console.log('localData');

        var storedKeys = [],
            storedValues = [],
            storedDataMatch = [];

        // get all the locally stored keys
        $.each(localData, function(key, data) {
            storedKeys.push(key);
            storedValues.push(data);
            // console.log(storedValues);
        });

        $.each(storedKeys, function(key, data) {
            // split the stored content key from "snow_1391533859577" into [snow, 1391533859577]
            var separator = '_',
                parts = data.split(separator);

            // iterate over each stored key
            $.each(parts, function(k, v){
                // get the condition (aka the first part) of the stored content key
                // ex. stored content key = [snow, 1391533859577]
                // find only "snow" ( aka parts[0] )
                if ( k === 0 ) {

                    // find any stored conditions that match todays condition
                    if ( v ===  todaysCond ) {
                        // add all the stored objs that matches todays condition to the dust data
                        storedDataMatch.push( JSON.parse(storedValues[key]) );
                    }
                }
            });
        });

        consolidated_json = consolidated_json.push({notes: storedDataMatch.reverse() });
        console.log(consolidated_json);

        callback = callback();

    }

    function getData() {
        var urls = ['data.json','http://poncho.is/s/i4R69/json/'],
            jxhr = [],
            pictures = [];

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

                }
            }
            if ( localStorage.length !== 0 && Modernizr.localstorage ) {
                modalWearOpen = false;
                modalAddOpen = false;
                // both varaibles are set in preprocessTodayWeatherData()
                getLocallyStoredData(weatherTodayCondition, weatherCurrentTemp, function(){
                    renderTemplates(currentState);
                });
            } else {
                renderTemplates(currentState);
            }

        });

    }

    function bindAddNoteEvents() {
        // open camera
        $('.camera-btn').on(touchOrClickEvent, function() {
            $('#camera').click();

            $('#camera').on('change', function(e) {
                var picture=e.target.files[0];
                loadPic(picture, function() {
                    console.log(picture);
                    setNoteFocus();
                });
            });
        });

        // scroll to text input for note
        $('.wrapper .note').on('focus', function() {
            $('html, body').animate({
                scrollTop: $(this).offset().top
            }, 'slow');
        });

        // do not submit data form
        $('#store-data').submit( function(e) {
            e.preventDefault();
        });

        // store data locally
        $('.store-note').on(touchOrClickEvent, function(e) {
            e.preventDefault();
            storeUserGenData(consolidated_json);
        });

        // Toggle Temp Up/Down
        $('.temps').on(touchOrClickEvent, function() {
            $('.more').animate({ height: "toggle" });
        });

        $('.back-btn').on(touchOrClickEvent, function(e) {
            e.preventDefault();
            window.history.back();

            if ( localStorage.length !== 0 ) {
                getLocallyStoredData(weatherTodayCondition, weatherCurrentTemp);
            }
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
        // hideUrlBar();
        getData();
    }

    $(document).ready(function() {
        loadBody();
    });


})(jQuery);