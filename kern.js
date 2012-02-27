/*
* Kern.JS 0.50
* http://www.kernjs.com
* Built by Brendan Stromberger, www.bstro.me

* Thanks to:
** Jonathan Vingiano <jonathanvingiano.com> for making the Kern.js engine purr.
** Nick Bogdanov at frague.github.com for adding major functionality to the app.
** Daniel Samson for converting this all into a Chrome widget at https://chrome.google.com/webstore/detail/mjdjmhnlobpmpcldklndglllamnlddmo?hl=en

* Special thanks to Mathew Luebbert at www.luebbertm.com for significant code contributions

* Thanks to the Lettering.JS team for being so cool and making the web a better place.
* Released under the WTFPL license 
* http://sam.zoy.org/wtfpl/
* Date: Tuesday, June 7 2011
*/
(function($) {
  "use strict";
  function kern() {
    var activeEl, thePanel, thePanelLocation, panelCss, outputPanel, html, activeHeader, emPx, lastX,
        transformFlag = 'kerning',
        altHold = 0,
        shiftHold = 0,
        location = "",
        unitFlag = "em",
        kerning = 0,
        adjustments = {};

    thePanelLocation = location + "kernjs.css";

    panelCss = document.createElement("link");
    panelCss.setAttribute("href", thePanelLocation);
    panelCss.setAttribute("rel", "stylesheet");
    panelCss.setAttribute("type", "text/css");
    document.getElementsByTagName("head")[0].appendChild(panelCss);

    thePanel = document.createElement("div");
    thePanel.id = "panel";
    thePanel.setAttribute("class", "kernjs_panel");
    $(thePanel).css('opacity', '0');

    $('<div id="kernjs_overlay"><div id="kernjs_dialogshade"></div><div id="kernjs_dialog">').appendTo($("body"));

    html = '<div class="kernjs_panel" id="kernjs_panel">';
    html +=   '<div id="kernjs_transformSelect">';
    html +=     '<div id="kernjs_input">';
    html +=       '<button value="kerning" class="active" id="kernjs_kern" name="kernjs_kern" /><div></div></button>';
    html +=       '<button value="size" id="kernjs_size" name="kernjs_size" /><div></div></button>';
    html +=       '<button value="leading" id="kernjs_vert" name="kernjs_vert" /><div></div></button>';
    html +=       '<button value="position" id="kernjs_pos" name="kernjs_pos" /><div></div></button>';
    html +=       '<button value="rotation" id="kernjs_angle" name="kernjs_angle" /><div></div></button>';
    html +=     '</div>';
    html +=   '</div>';
    html += '</div>';
    html +=       '<button value="go" id="kernjs_complete" name="kernjs_gobutton" /><div></div></button>';

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
      // this.make_relative();
      this.kerning += x;
      this.element.css('margin-left', this.kerning.toString() + 'px'); // make live adjustment in DOM
      this.vertical += y;
      this.element.css('top', this.vertical.toString() + 'px'); // make live adjustment in DOM
    };

    // Size adjustment logic
    Adjustment.fn.set_size = function (s) {
      // if (transformFlag!=='size') { return; }
      this.size += s;
      this.element.css('font-size', this.size + '%'); // change letter size
    };
    
    // Size adjustment logic
    Adjustment.fn.set_angle = function (a) {
      if (transformFlag !== 'rotation') {
        return;
      }
      this.angle += a;
      // this.make_relative(); We should probably make this relative all the time regar
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
            concatCSS = [x + " {", adj.to_css(unitFlag === 'em'), '}'].join('\n');
            theCSS = theCSS + '\n' + concatCSS;
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
      return $.each(el.children(), function (index, value) {
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
      var emRatio, el, previousColor, theHtml, bounding_box, elid;
      elid = ""; // if the user clicks on a header element with an ID, elid is set to be equal to the ID of the header element.
      event.preventDefault(); // Prevent headers that are also links from following the URL while Kern.JS is active.
      if (activeHeader !== this) {
        activeHeader = this;
        emRatio = $("<span />").appendTo(event.target).css('height', '1em').css('visibility', 'hidden'); // This little guy finds the pixel size of 1em.
        emPx = emRatio.height();
        emRatio.detach(); // Retrieves the height value from emRatio, store it, and destroy emRatio since we don't need it anymore.
        el = findRootHeader(event.target);
        elid += el.tagName.toLowerCase() + " "; 

        el.bounding_box = getTextNodeDimensions(el);        
        $("<div id='kernjs_boundingbox'>").css({ // Creates the bounding box with some manual correction for whitespace.
          'height': el.bounding_box.height - 40,
          'width': el.bounding_box.width + 40,
          'top': el.bounding_box.top + 20,
          'left': el.bounding_box.left - 20,
        }).appendTo($("body"));
        
        if ($(el).attr('id')) { // If the clicked header has an ID...
          elid += "#" + $(el).attr('id') + " "; //...set elid to be a css string representation of the header's id (for example, "#myheader")
        }

        if ($) {
          theHtml = splitter($(el)); // Call method from Lettering.js. This method splits up the clicked body of text into <span> elements containing single letters.
        }

        $(this).attr('unselectable', 'on').css('-moz-user-select', 'none').each(function () {
          this.onselectstart = function () {
            return false;
          };
        });

        $(window).mousedown(function (event) { // Listens for clicks on the entire document. Currently problematic.
          var adj, lastX, lastY, that, original_color;
          function MoveHandler(event) {
            var moveX = event.pageX - lastX,
              moveY = event.pageY - lastY,
              renew = 0;
            if (event.altKey || transformFlag === "size") { // If Shift key is pressed - change letter size
              adj.set_size(moveX);
              renew = 1;
            } else if (event.shiftKey || transformFlag === "rotation") { // If Alt key is pressed - rotate letter
              adj.set_angle(moveX);
              renew = 1;
            } else if (event.ctrlKey || transformFlag === "position") {
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
            
            el.bounding_box = getTextNodeDimensions(el); // These lines allow the bounding box to react to changes on activeEl
            
            $("#kernjs_boundingbox").css({
              'height': el.bounding_box.height - 40,
              'width': el.bounding_box.width + 40,
              'top': el.bounding_box.top + 20,
              'left': el.bounding_box.left - 20,
            }); 
          }         
          if($.contains(el, event.target)) {
            activeEl = event.target; // Set activeEl to represent the clicked letter.
            lastX = event.pageX;
            lastY = event.pageY;
            if (typeof (adjustments[elid + "." + $(activeEl).attr("class")]) === 'undefined') {
              adjustments[elid + "." + $(activeEl).attr("class")] = new Adjustment($(activeEl));
            }
            adj = adjustments[elid + "." + $(activeEl).attr("class")];
            $(this).bind('mousemove', MoveHandler);
            $(this).mouseup(function (event) {
              $(this).unbind('mousemove', MoveHandler);
            });
          }
        });
        // end el click
      }
    });

    $(document).keydown(function (event) { // This feels cludgy and should probably be rewritten at some point b/c there is a lot of reused code.
      var elid = "",
        renew = 0,
        adj;
      if (activeEl) {
        elid += activeEl.tagName.toLowerCase() + " ";
        if ($(activeEl).parent().attr('id')) {
          elid += "#" + $(activeEl).parent().attr('id') + " ";
        }
        if (adjustments[elid + "." + $(activeEl).attr("class")]) { // If there are current adjustments already made for this letter
          adj = adjustments[elid + "." + $(activeEl).attr("class")]; // Set the kerning variable to the previously made adjustments for this letter (stored inside the adjustments dictionary object)
        } else {
          adj = new Adjustment($(activeEl));
        }
        if (event.which === 37) { // If left arrow key
          adj.set_position(-1, 0);
          renew = 1;
        }
        if (event.which === 39) { // If right arrow key
          adj.set_position(1, 0);
          renew = 1;
        }
        if (event.which === 38) { // If up arrow key
          adj.set_position(0, -1);
          renew = 1;
        }
        if (event.which === 40) { // If down arrow key
          adj.set_position(0, 1);
          renew = 1;
        }
        if (renew) {
          event.stopPropagation();
          adjustments[elid + "." + $(activeEl).attr("class")] = adj; // add/modify the current letter's kerning information to the "adjustments" object.
          generateCSS(adjustments, emPx, unitFlag);
        }
      }
    });
    
    $("#kernjs_textarea").live('click', function () {
      $(this).focus();
      $(this).select();
    });
    
    $("#kernjs_complete").click(function () {
      var outputHTML = '';
      var transitionEnd = "TransitionEnd";
      
      if ($.browser.webkit) {
      	transitionEnd = "webkitTransitionEnd";
      } else if ($.browser.mozilla) {
      	transitionEnd = "transitionend";
      } else if ($.browser.opera) {
      	transitionEnd = "oTransitionEnd";
      }
      
      if (activeEl) {  
        outputHTML += '<div id="kernjs_container">';
        outputHTML +=     '<textarea id="kernjs_textarea">' + generateCSS(adjustments, emPx, unitFlag) + '</textarea>';
        outputHTML += '</div';
      } else {
        outputHTML += '<div id="kernjs_container">';
        outputHTML +=   '<div id="kernjs_p">';
        outputHTML +=     '<textarea>' + 'You haven\'t made any adjustments yet.' + '</textarea>';
        outputHTML +=   '</div><br/>';
        outputHTML += '</div';
      }
      
      $("#kernjs_dialog").html(outputHTML).appendTo($("#kernjs_overlay"));
      
      $("#kernjs_overlay").css({
        'height': '100% !important',
        'opacity': '1 !important'
      });
      $("#kernjs_dialog").css({
        '-webkit-transform': 'scale(1) !important',
        '-moz-transform': 'scale(1) !important',
        'transform': 'scale(1) !important'
      });
      
      $("#kernjs_dialogshade").bind('click', function() {
        $("#kernjs_dialog").css({
          '-webkit-transform': 'scale(1.03) !important',
          '-moz-transform': 'scale(1.03) !important',
          'transform': 'scale(1.03) !important'
        });
        $("#kernjs_overlay").bind(transitionEnd, function() { 
            $(this).unbind(transitionEnd);
            $("#kernjs_overlay").css({ height: "0 !important" });
        });
        $("#kernjs_overlay").css({ opacity: "0 !important" });
      });
    });
  }
  kern();
})(jQuery);