(function($, undefined) {
    "use strict";

    function loadBody() {

        $.getJSON("data.json", function(data){

            dust.render("body", data, function(err, out) {

                $("body").html(out);

            });
        });
    }

    $(document).ready(function() {
        loadBody();
    });

})(jQuery);