/*
* Kern.JS v2.01
* http://www.kernjs.com
* Built by Brendan Stromberger, www.bstro.me

* Thanks to:
** Jonathan Vingiano <jonathanvingiano.com> for making the Kern.js engine purr.
** Nick Bogdanov at frague.github.com for adding major functionality to the app.

* Special thanks to Mathew Luebbert at www.luebbertm.com for significant code contributions

* Thanks to the Lettering.JS team for being so cool and making the web a better place.
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
* Date: September 28, 2012
*/
(function($) {
  "use strict";
  function gaTrack(g,h,i){function c(e,j){return e+Math.floor(Math.random()*(j-e))}var f=1000000000,k=c(f,9999999999),a=c(10000000,99999999),l=c(f,2147483647),b=(new Date()).getTime(),d=window.location,m=new Image(),n='http://www.google-analytics.com/__utm.gif?utmwv=1.3&utmn='+k+'&utmsr=-&utmsc=-&utmul=-&utmje=0&utmfl=-&utmdt=-&utmhn='+h+'&utmr='+d+'&utmp='+i+'&utmac='+g+'&utmcc=__utma%3D'+a+'.'+l+'.'+b+'.'+b+'.'+b+'.2%3B%2B__utmb%3D'+a+'%3B%2B__utmc%3D'+a+'%3B%2B__utmz%3D'+a+'.'+b+'.2.2.utmccn%3D(referral)%7Cutmcsr%3D'+d.host+'%7Cutmcct%3D'+d.pathname+'%7Cutmcmd%3Dreferral%3B%2B__utmv%3D'+a+'.-%3B';m.src=n}
  function kern() {
    var activeEl, thePanel, thePanelLocation, panelCss, outputPanel, html, activeHeader, emPx, lastX,
        transformFlag = 'kerning',
        altHold = 0,
        shiftHold = 0,
        location = "",
        unitFlag = "em",
        kerning = 0,
        adjustments = {};

    panelCss = document.createElement("style");
    panelCss.setAttribute("rel", "stylesheet");
    panelCss.innerHTML = "#kernjs_panel,#kernjs_panel *,#kernjs_dialog,#kernjs_dialog *{border:none!important;display:block!important;margin:0!important;outline:none!important;padding:0!important;background:none!important;cursor:auto!important;clear:none!important;float:none!important;height:auto!important;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;visibility:visible!important;width:auto!important;bottom:auto!important;clip:auto!important;left:auto!important;overflow:auto!important;position:relative!important;right:auto!important;top:auto!important;vertical-align:top!important;z-index:1!important;color:#000!important;direction:ltr!important;font:normal normal normal 11px/14px 'Helvetica Neue',Helvetica,Arial,sans-serif!important;font-size-adjust:none!important;font-stretch:normal!important;letter-spacing:normal!important;list-style:none!important;text-align:left!important;text-decoration:none!important;text-indent:0!important;text-shadow:none!important;text-transform:none!important;unicode-bidi:normal;white-space:normal!important;word-spacing:normal!important;border-collapse:collapse!important;border-spacing:0!important;caption-side:left!important;empty-cells:hide!important;table-layout:auto!important}.kernjs_activeEl{opacity:.5!important}#panel{background:white!important;border-bottom:1px solid #cacaca!important;height:3px!important;width:100%!important;position:fixed!important;top:0!important;-moz-transition:opacity .5s ease!important;-webkit-transition:opacity .5s ease!important;transition:opacity .5s ease!important;-webkit-backface-visibility:hidden!important}#panel.kernjs_disabled{opacity:.5!important}#kernjs_panel *{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif!important}#kernjs_panel{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif!important;font-weight:900!important;font-size:16px!important;text-transform:none!important;position:fixed!important;top:0!important;z-index:2147483644!important;text-align:center!important;height:auto!important;width:100%!important;margin:0 auto!important;padding:0 0 0 0!important}#kernjs_transformSelect{border:1px solid #cacaca!important;border-top:1px solid #fff!important;background-color:#FFF!important;width:310px!important;height:auto!important;display:inline-block!important;border-bottom-left-radius:8px!important;border-bottom-right-radius:8px!important;overflow:hidden!important;margin:0 auto!important;margin-top:3px!important;position:relative!important}#kernjs_input{margin:0 3px 3px 3px!important;display:inline-block!important;background-color:#e8e8e8!important;border:1px solid rgba(0,0,0,0.15)!important;width:auto!important;height:auto!important;-webkit-box-shadow:inset 0 0 0 1px rgba(255,255,255,0.75)!important;-moz-box-shadow:inset 0 0 0 1px rgba(255,255,255,0.75)!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.75)!important;border-radius:4px!important}#kernjs_transformSelect button div{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAAAeCAYAAABg1PHWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpDNjQ4RTY3NDExMjA2ODExOUVDQ0JGQTZFNTgyMzBFRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBRTlFQ0NFNjc2OEIxMUUxQjI1QUQ2NUNFNTIyMzRENSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBRTlFQ0NFNTc2OEIxMUUxQjI1QUQ2NUNFNTIyMzRENSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDI4MDExNzQwNzIwNjgxMThGNjJBNjUyQjQ3NzIyNDQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzY0OEU2NzQxMTIwNjgxMTlFQ0NCRkE2RTU4MjMwRUYiLz4gPC9yZGY6RGVzY3Jp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";

    document.getElementsByTagName("head")[0].appendChild(panelCss);

    thePanel = document.createElement("div");
    thePanel.id = "panel";
    thePanel.setAttribute("class", "kernjs_disabled");

    $('<div id="kernjs_overlay"><div id="kernjs_dialogshade"></div><div id="kernjs_dialog">').appendTo($("body"));
    $("<link href='http://fonts.googleapis.com/css?family=Anonymous+Pro' rel='stylesheet' type='text/css'>").appendTo($("head"));

    html = '<div class="kernjs_panel" id="kernjs_panel">';
    html +=   '<div id="kernjs_transformSelect">';
    html +=     '<div id="kernjs_input">';
    html +=       '<button value="kerning" class="active" id="kernjs_kern" name="kernjs_kern" /><div></div></button>';
    html +=       '<button value="size" id="kernjs_size" name="kernjs_size" /><div></div></button>';
    html +=       '<button value="leading" id="kernjs_vert" name="kernjs_vert" /><div></div></button>';
    html +=       '<button value="position" id="kernjs_pos" name="kernjs_pos" /><div></div></button>';
    html +=       '<button value="rotation" id="kernjs_angle" name="kernjs_angle" /><div></div></button>';
    html +=     '</div>';
    html +=     '<div id="kernjs_generateSelect">';
    html +=       '<button value="generate" id="kernjs_generate" name="kernjs_generate" /><div></div></button>';
    html +=     '</div>';
    html +=   '</div>';
    html += '</div>';

    thePanel.innerHTML = html;
    $("body").prepend(thePanel);

    $("#kernjs_panel").after($("<div id='spacer'></div>").css('height', $(".kernjs_panel").css("height")));

    $(".kernjs_panel").animate({
      opacity: 1
    });

    $("#kernjs_input button").click(function () {
      $("#kernjs_input button").removeClass('active');
      transformFlag = $(this).addClass('active').attr('value');
    });

    // Returns value in em
    function em(value) {
      return (Math.round((value / emPx) * 1000) / 1000).toString();
    }

    // Contains all CSS adjustments made to separate letter
    function Adjustment(el) {
      this.element = el;
      this.kerning = 0;
      this.vertical = (this.element.css('position') === 'relative') ? parseInt(this.element.css('top')) : 0; // If element is relatively positioned - get it's top offset
      if (isNaN(this.vertical)) {
        this.vertical = 0;
      }
      this.size = 100;
      this.angle = 0;
      this.element.css('position', 'relative'); // make position relative
      this.element.css('display', 'inline-block'); // make position relative
      this.element.css('vertical-align', 'top'); // prevents something horrible from happening.
    }

    // alias .fn to .prototype
    Adjustment.fn = Adjustment.prototype;

    // Kerning adjustment logic
    Adjustment.fn.set_kerning = function (k) {
      // if (transformFlag!=='kerning') { return; }
      this.kerning += k;
      this.element.css('margin-left', this.kerning.toString() + 'px'); // make live adjustment in DOM
    };

    // Makes letter relative
    Adjustment.fn.make_relative = function () {
      if (this.angle || this.vertical) {
        this.element.css('position', 'relative'); // make position relative
        this.element.css('display', 'inline-block'); // make position relative
      } else {
        this.element.css('position', 'inline'); // make position back inline
      }
    };

    // Vertical offset adjustment logic
    Adjustment.fn.set_vertical = function (v) {
      // if (transformFlag!=='leading') { return; }
      // this.make_relative();
      this.vertical += v;
      this.element.css('top', this.vertical.toString() + 'px'); // make live adjustment in DOM
    };

    // Allows simultaneous x/y movement.
    Adjustment.fn.set_position = function (x, y) {
      this.kerning += x;
      this.element.css('margin-left', this.kerning.toString() + 'px'); // make live adjustment in DOM
      this.vertical += y;
      this.element.css('top', this.vertical.toString() + 'px'); // make live adjustment in DOM
    };

    // Size adjustment logic
    Adjustment.fn.set_size = function (s) {
      this.size += s;
      this.element.css('font-size', this.size + '%'); // change letter size
    };

    // Size adjustment logic
    Adjustment.fn.set_angle = function (a) {
      if (transformFlag !== 'rotation') {
        return;
      }
      this.angle += a;
      var deg = 'rotate(' + Math.round(this.angle) + 'deg)';
      this.element.css('-webkit-transform', deg);
      this.element.css('-moz-transform', deg);
      this.element.css('-o-transform', deg);
      this.element.css('-ms-transform', deg);
      this.element.css('transform', deg);
    };

    // Converting adjustment to css
    Adjustment.fn.to_css = function (in_em) {
      var deg, css;
      css = new Array();
      css.push('vertical-align: top;');
      if (this.kerning) { // Kerning
        css.push('margin-left: ' + (in_em ? em(this.kerning) + 'em;' : this.kerning.toString() + 'px;'));
      }
      if (this.vertical || this.angle) { // Relative positioning
        css.push('display: inline-block;');
        css.push('position: relative;');
        if (this.vertical) { // Vertical offset
          css.push('top: ' + (in_em ? em(this.vertical) + 'em;' : this.vertical.toString() + 'px;'));
        }
        if (this.angle) { // Angle
          deg = ': rotate(' + Math.round(this.angle) + 'deg);';
          css.push('-webkit-transform' + deg);
          css.push('-moz-transform' + deg);
          css.push('-ms-transform' + deg);
          css.push('-o-transform' + deg);
          css.push('transform' + deg);
        }
      }
      if (this.size !== 100) { // Font size
        css.push('font-size: ' + this.size + '%;');
      }
      return '\t' + css.join('\n\t');
    };

    function getTextNodeDimensions(textNode) { // Helper function for creating the bounding box overlay around activeEl
        var rect = {};
        if (document.createRange) {
            var range = document.createRange();
            range.selectNodeContents(textNode);
            if (range.getBoundingClientRect) {
                rect = range.getBoundingClientRect();
            }
        }
        return rect;
    }

    // This function takes the stored adjustment data and constructs formatted CSS from it.
    function generateCSS(adjustments, emPx, unitFlag) {
      var x, concatCSS, adj, theCSS = [];
      for (x in adjustments) {
        if (adjustments.hasOwnProperty(x)) {
          adj = adjustments[x];
          if(x !== '.undefined') {
            concatCSS = [x + " {", adj.to_css(unitFlag === 'em'), '}', '\n'].join('\n');
            theCSS = theCSS + concatCSS;
          }
        }
      }
      return theCSS;
    }

    // This function finds the h(x) tag wrapping the thing you clicked
    function findRootHeader(el) {
      var toReturn;
      toReturn = el;
      while ($.inArray($(toReturn).get(0).tagName, ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']) < 0) {
        toReturn = $(toReturn).parent();
      }
      return toReturn;
    }

    // The following two functions (splitter and injector) are modified versions of Lettering.JS functions. Using these allows Lettering.JS and Kern.JS to work together well.
    function splitter(el) {
      if ($(el).children().length === 0) {
        return injector($(el), '', 'char', '');
      }
      return $.each($(el).children(), function (index, value) {
        splitter(value);
      });
    }

    function injector(t, splitter, klass, after) {
      var a = t.text().split(splitter),
        inject = '';
      if (a.length > 1) {
        $(a).each(function (i, item) {
          inject += '<span class="' + klass + (i + 1) + '">' + item + '</span>' + after;
        });
        t.empty().append(inject);
      }
    }

    $("h1, h2, h3, h4, h5, h6").click(function (event) { // Activate a word
      var emRatio, el, previousColor, theHtml, elid;
      elid = ""; // if the user clicks on a header element with an ID, elid is set to be equal to the ID of the header element.
      event.preventDefault(); // Prevent headers that are also links from following the URL while Kern.JS is active.
      if (activeHeader !== this) {
        activeHeader = this;
        emRatio = $("<span />").appendTo(event.target).css('height', '1em').css('visibility', 'hidden'); // This little guy finds the pixel size of 1em.
        emPx = emRatio.height();
        emRatio.detach(); // Retrieves the height value from emRatio, store it, and destroy emRatio since we don't need it anymore.
        el = findRootHeader(this);
        elid += el.tagName.toLowerCase() + " ";

        $(".kernjs_disabled").removeClass('kernjs_disabled');

        $("#kernjs_boundingbox").fadeOut(function() {
          $(this).detach(); // destroys all existing bounding boxes.
        });

        el.boundingbox = getTextNodeDimensions(el);
        $("<div id='kernjs_boundingbox'>").css({ // Creates the bounding box with some manual correction for whitespace.
          'height': el.boundingbox.height - 40,
          'width': el.boundingbox.width + 40,
          'top': el.boundingbox.top + 20,
          'left': el.boundingbox.left - 20,
        }).appendTo($("body"));

        if ($(el).attr('id')) { // If the clicked header has an ID...
          elid += "#" + $(el).attr('id') + " "; //...set elid to be a css string representation of the header's id (for example, "#myheader")
        }

        if ($) {
          theHtml = splitter($(el)); // Call method from Lettering.js. This method splits up the clicked body of text into <span> elements containing single letters.
        }

        $(this).attr('unselectable', 'on').css({
          '-moz-user-select': 'none',
          '-webkit-user-select': 'none'
        }).each(function () {
          this.onselectstart = function () {
            return false;
          };
        });

        $(window).keydown(function (event) {
          var thisKey = event.which;
          if(thisKey === 86 || thisKey === 52) { // v for abs pos
            $(".active").removeClass('active');
            $("#kernjs_pos").addClass('active');
            transformFlag = "position";
          }
          if(thisKey === 83 || thisKey === 50 ) { // s for scale
            $(".active").removeClass('active');
            $("#kernjs_size").addClass('active');
            transformFlag = "size"
          }
          if(thisKey === 76 || thisKey === 51) { // l for leading
            $(".active").removeClass('active');
            $("#kernjs_vert").addClass('active');
            transformFlag = "leading";
          }
          if(thisKey === 82 || thisKey === 53) { // r for rotation
            $(".active").removeClass('active');
            $("#kernjs_angle").addClass('active');
            transformFlag = "rotation";
          }
          if(thisKey === 190 || thisKey === 49) { // . for kerning
            $(".active").removeClass('active');
            $("#kernjs_kern").addClass('active');
            transformFlag = "kerning";
          }
        });

        $(window).mousedown(function (event) { // Listens for clicks on the entire document. Currently problematic.
          var adj, lastX, lastY, that, original_opacity;

          original_opacity = $(event.target).css('opacity'); // save the activeEl's original color so we can restore it later.

          function MoveHandler(event) {
            var moveX = event.pageX - lastX,
              moveY = event.pageY - lastY,
              renew = 0;
            if (event.altKey || transformFlag === "size") { // If Shift key is pressed - change letter size
              adj.set_size(moveX);
              renew = 1;
            } else if (event.metaKey || transformFlag === "rotation") { // If Alt key is pressed - rotate letter
              adj.set_angle(moveX);
              renew = 1;
            } else if (event.ctrlKey || transformFlag === "position") {
              event.preventDefault()
              adj.set_position(moveX, moveY);
              renew = 1;
            } else if (transformFlag === "kerning") {
              if (moveX !== 0) {
                adj.set_kerning(moveX);
                renew = 1;
              }
            } else if (transformFlag === "leading") {
              if (moveY !== 0) {
                adj.set_vertical(moveY);
                renew = 1;
              }
            }
            lastX = event.pageX;
            lastY = event.pageY;
            if (renew) {
              adjustments[elid + "." + $(activeEl).attr("class")] = adj;
              generateCSS(adjustments, emPx, unitFlag); // make stored adjustment in generated CSS
            }

            el.boundingbox = getTextNodeDimensions(el); // These lines allow the bounding box to react to changes on activeEl

            $("#kernjs_boundingbox").css({
              'height': el.boundingbox.height - 40,
              'width': el.boundingbox.width + 40,
              'top': el.boundingbox.top + 20,
              'left': el.boundingbox.left - 20,
            });
          }
          if($.contains(el, event.target)) {
            activeEl = event.target; // Set activeEl to represent the clicked letter.

            $(activeEl).css('opacity', '0.5');

            lastX = event.pageX;
            lastY = event.pageY;
            if (typeof (adjustments[elid + "." + $(activeEl).attr("class")]) === 'undefined') {
              adjustments[elid + "." + $(activeEl).attr("class")] = new Adjustment($(activeEl));
            }
            adj = adjustments[elid + "." + $(activeEl).attr("class")];
            $(this).bind('mousemove', MoveHandler);
            $(this).mouseup(function (event) {
              $(this).unbind('mousemove', MoveHandler);
              $(activeEl).css('opacity', original_opacity);
            });
          }
        });
        // end el click
      }
    });

    $("#kernjs_textarea").live('click', function () {
      $(this).focus();
      $(this).select();
    });

    $("#kernjs_generate").click(function () {
      var outputHTML = '';
      var transitionEnd = "TransitionEnd";

      $("#kernjs_overlay").addClass('kernjs_animate');

      if ($.browser.webkit) {
        transitionEnd = "webkitTransitionEnd";
      } else if ($.browser.mozilla) {
        transitionEnd = "transitionend";
      } else if ($.browser.opera) {
        transitionEnd = "oTransitionEnd";
      }

      if (activeEl) {
        outputHTML += '<div id="kernjs_container">';
        outputHTML +=   '<textarea id="kernjs_textarea">' + generateCSS(adjustments, emPx, unitFlag) + '</textarea>';
        outputHTML +=   '<div id="kernjs_units">';
        outputHTML +=     '<a id="kernjs_units_label" href="javascript:void(0)">Switch to pixels</a>';
        outputHTML +=   '</div>';
        outputHTML += '</div';
      } else {
        outputHTML += '<div id="kernjs_container">';
        outputHTML +=     '<textarea id="kernjs_textarea">' + 'You haven\'t made any adjustments yet.' + '</textarea>';
        outputHTML += '</div';
      }

      $("#kernjs_dialog").html(outputHTML).appendTo($("#kernjs_overlay"));
      $('#kernjs_overlay').addClass('kernjs_overlay_active');
      $("#kernjs_dialog").addClass('kernjs_dialog_active');

      $("#kernjs_units").bind('click', function() {
        if (unitFlag === "em") {
          unitFlag = "px";
          $("#kernjs_units_label").html("Switch to ems");
        }
        else {
          unitFlag = "em";
          $("#kernjs_units_label").html("Switch to pixels");
        }
        $("#kernjs_textarea").html(generateCSS(adjustments, emPx, unitFlag));
      });

      $("#kernjs_dialogshade").bind('click', function() {
        $("#kernjs_dialog").removeClass('kernjs_dialog_active');
        $("#kernjs_overlay").removeClass('kernjs_overlay_active');
      });
    });
  }
  kern();
  gaTrack('UA-9943083-3', 'kernjs.com', '/bookmarklet');
})(jQuery);