(function(){dust.register("addnote",body_0);var blocks={"bodyContent":body_1};function body_0(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.partial("page",ctx,null);}function body_1(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.write("<header class=\"header row\"><div class=\"container col-xs-12\"><h2 class=\"title\"><span class=\"text\">Add a Note</span><a class=\"btn btn-lg back-btn\" href=\"#\"><span class=\"glyphicon glyphicon-chevron-left\"></a></h2></div></header><section class=\"body row\"><div class=\"wrapper col-xs-12\"><button class=\"btn btn-default btn-lg camera-btn\"><span class=\"glyphicon glyphicon-camera\"></span></button><form role=\"form\" id=\"store-data\"><input id=\"camera\" type=\"file\" accept=\"image/*\" capture=\"camera\"><div class=\"form-group\"><textarea class=\"form-control note\" rows=\"3\" placeholder=\"Spill it!\"></textarea></div><p class=\"error no-note\">Please add an image or text.</p><p class=\"error no-storage\">Oops! Your browser won't allow a note to be stored. Please use Chrome or Safari.</p><button type=\"submit\" class=\"btn btn-default btn-lg store-note\">Store This!</button></form></div></section>");}return body_0;})();
(function(){dust.register("footer",body_0);function body_0(chk,ctx){return chk.write("<footer class=\"footer\">").partial("temps",ctx,null).partial("navbar",ctx,null).write("</footer>").partial("googleanalytics",ctx,null);}return body_0;})();
(function(){dust.register("googleanalytics",body_0);function body_0(chk,ctx){return chk.write("<!-- Google Analytics: change UA-XXXXX-X to be your site's ID. --><script>(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;e=o.createElement(i);r=o.getElementsByTagName(i)[0];e.src='//www.google-analytics.com/analytics.js';r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));ga('create','UA-XXXXX-X');ga('send','pageview');</script>");}return body_0;})();
(function(){dust.register("navbar",body_0);function body_0(chk,ctx){return chk.write("<nav class=\" navbar-default navbar-fixed-bottom\" role=\"navigation\"><ul class=\"nav nav-pills nav-justified\">").section(ctx._get(false, ["nav"]),ctx,{"block":body_1},null).write("</ul></nav>");}function body_1(chk,ctx){return chk.write("<li><a href=\"#").reference(ctx._get(false, ["name"]),ctx,"h").write("\"><span class=\"glyphicon glyphicon-").reference(ctx._get(false, ["icon"]),ctx,"h").write("\"></a></li>");}return body_0;})();
(function(){dust.register("ponchoforecast",body_0);function body_0(chk,ctx){return chk;}return body_0;})();
(function(){dust.register("temps",body_0);function body_0(chk,ctx){return chk.write("<section class=\"temps\"><div class=\"current col-xs-12\"><img src=\"libs/img/").reference(ctx._get(false,["data","weather1"]),ctx,"h").write("\" alt=\"rainy\" width=\"44px\"><div><h3>").reference(ctx._get(false,["data","temp1"]),ctx,"h").write("</h3><h4>40/22</h4></div></div><div class=\"more col-xs-12\"><div class=\"time col-xs-4\"><img src=\"libs/img/").reference(ctx._get(false,["data","weather2"]),ctx,"h").write("\" alt=\"rainy\" width=\"44px\"><h3>38</h3><time class=\"timestamp\" datetime=\"2014-01-20T18:50:00-0500\">2PM</time></div><div class=\"time col-xs-4\"><img src=\"libs/img/").reference(ctx._get(false,["data","weather3"]),ctx,"h").write("\" alt=\"rainy\" width=\"44px\"><h3>38</h3><time class=\"timestamp\" datetime=\"2014-01-20T18:50:00-0500\">2PM</time></div><div class=\"time col-xs-4\"><img src=\"libs/img/").reference(ctx._get(false,["data","weather4"]),ctx,"h").write("\" alt=\"rainy\" width=\"44px\"><h3>38</h3><time class=\"timestamp\" datetime=\"2014-01-20T18:50:00-0500\">2PM</time></div></div></section>");}return body_0;})();
(function(){dust.register("forecast",body_0);var blocks={"bodyContent":body_1};function body_0(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.partial("page",ctx,null);}function body_1(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.write("<header class=\"header row\"><div class=\"container col-xs-12\"><!-- <div class=\"input-group search\"><input type=\"text\" placeholder=\"Where you at?\" class=\"form-control\"><span class=\"input-group-btn\"><button class=\"btn btn-default\" type=\"button\"><span class=\"glyphicon glyphicon-search\"></span></button></span></div> --><!-- /input-group --><h2 class=\"title\"><span class=\"text\">Forecast</span></h2></div></header><section class=\"body row\"><div class=\"wrapper col-xs-12\">").section(ctx._get(false, ["forecast"]),ctx,{"block":body_2},null).write("</div></section>");}function body_2(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.write("<h1 class=\"subject\">").reference(ctx._get(false, ["subject"]),ctx,"h").write("</h1><p class=\"text\">").reference(ctx._get(false, ["body"]),ctx,"h").write("</p><div class=\"gif\">").exists(ctx._get(false, ["media"]),ctx,{"block":body_3},null).write("</div>");}function body_3(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.write("<img class=\"img\" src=\"").reference(ctx._get(false, ["media"]),ctx,"h").write("\" alt=\"img\">");}return body_0;})();
(function(){dust.register("page",body_0);function body_0(chk,ctx){return chk.write("<section class=\"page-body\">").block(ctx.getBlock("bodyContent"),ctx,{},null).write("</section>").block(ctx.getBlock("pageFooter"),ctx,{"block":body_1},null);}function body_1(chk,ctx){return chk.partial("footer",ctx,null);}return body_0;})();
(function(){dust.register("wear",body_0);var blocks={"bodyContent":body_1};function body_0(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.partial("page",ctx,null);}function body_1(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.write("<header class=\"header row\"><div class=\"container col-xs-12 \"><h2 class=\"title\"><span class=\"text\">Don't forget!</span><a class=\"btn btn-lg add-btn\" href=\"#addnote\"><span class=\"glyphicon glyphicon-plus\"></a></h2></div></header><section class=\"body row\"><div class=\"wrapper col-xs-12 wear-page\"><p class=\"text\">It's gonna be cloudy and rainy today so wear your rainboots!</p><div class=\"gif\"><img class=\"img\" src=\"http://placehold.it/300x169\" alt=\"img\"></div></div><!-- Modal --><div class=\"modal fade\" id=\"myModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button><h4 class=\"modal-title\" id=\"myModalLabel\">Modal title</h4></div><div class=\"modal-body\"><p>Leave yourself a note. The next time the weather is similar to todays' you'll get a reminder, from YOURSELF!</p><p>Perhaps your note will look like this:</p></div></div><!-- /.modal-content --></div><!-- /.modal-dialog --></div><!-- /.modal --></section>");}return body_0;})();