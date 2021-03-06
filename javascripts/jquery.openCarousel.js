
/*
jQuery Open Carousel

Copyright (c) 2013 Justin McCandless (justinmccandless.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*
This is the main coffeescript file
Include jquery.openCarousel.js and jquery.openCarousel.css in your projects
*/

(function() {
  var Ocarousel;

  Ocarousel = (function() {
    /* Initialize
    */
    Ocarousel.prototype.ocarousel = null;

    Ocarousel.prototype.ocarousel_window = null;

    Ocarousel.prototype.ocarousel_container = null;

    Ocarousel.prototype.frames = null;

    Ocarousel.prototype.indicators = null;

    Ocarousel.prototype.timer = null;

    Ocarousel.prototype.active = 0;

    /* Default Settings
    */

    Ocarousel.settings = {
      speed: .5 * 1000,
      period: 4 * 1000,
      transition: "scroll",
      perscroll: 1,
      wrapearly: 0,
      shuffle: false,
      indicator_fill: "#ffffff",
      indicator_r: 6,
      indicator_spacing: 6,
      indicator_cy: 20,
      indicator_stroke: "#afafaf",
      indicator_strokewidth: "2"
    };

    function Ocarousel(ocarousel) {
      var cx, i, indicator, indicators_container, indicators_svg, me, _ref, _ref10, _ref11, _ref12, _ref13, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      me = this;
      this.ocarousel = $(ocarousel);
      this.ocarousel_window = $(this.ocarousel).children(".ocarousel_window");
      this.frames = $(this.ocarousel_window).children();
      indicators_container = $(this.ocarousel).children(".ocarousel_indicators");
      if (this.frames.length > 1) {
        this.settings = {};
        this.settings.speed = (_ref = $(this.ocarousel).data('ocarousel-speed')) != null ? _ref : Ocarousel.settings.speed;
        this.settings.period = (_ref2 = $(this.ocarousel).data('ocarousel-period')) != null ? _ref2 : Ocarousel.settings.period;
        this.settings.transition = (_ref3 = $(this.ocarousel).data('ocarousel-transition')) != null ? _ref3 : Ocarousel.settings.transition;
        this.settings.perscroll = (_ref4 = $(this.ocarousel).data('ocarousel-perscroll')) != null ? _ref4 : Ocarousel.settings.perscroll;
        this.settings.wrapearly = (_ref5 = $(this.ocarousel).data('ocarousel-wrapearly')) != null ? _ref5 : Ocarousel.settings.wrapearly;
        this.settings.shuffle = (_ref6 = $(this.ocarousel).data('ocarousel-shuffle')) != null ? _ref6 : Ocarousel.settings.shuffle;
        this.settings.indicator_fill = (_ref7 = $(this.ocarousel).data('ocarousel-indicator-fill')) != null ? _ref7 : Ocarousel.settings.indicator_fill;
        this.settings.indicator_r = (_ref8 = $(this.ocarousel).data('ocarousel-indicator-r')) != null ? _ref8 : Ocarousel.settings.indicator_r;
        this.settings.indicator_spacing = (_ref9 = $(this.ocarousel).data('ocarousel-indicator-spacing')) != null ? _ref9 : Ocarousel.settings.indicator_spacing;
        this.settings.indicator_cy = (_ref10 = $(this.ocarousel).data('ocarousel-indicator-cy')) != null ? _ref10 : Ocarousel.settings.indicator_cy;
        this.settings.indicator_stroke = (_ref11 = $(this.ocarousel).data('ocarousel-indicator-stroke')) != null ? _ref11 : Ocarousel.settings.indicator_stroke;
        this.settings.indicator_strokewidth = (_ref12 = $(this.ocarousel).data('ocarousel-indicator-strokewidth')) != null ? _ref12 : Ocarousel.settings.indicator_strokewidth;
        this.ocarousel_container = document.createElement("div");
        this.ocarousel_container.className = "ocarousel_window_slides";
        if (this.settings.shuffle === true) {
          this.frames.sort(function() {
            return Math.round(Math.random()) - 0.5;
          });
        }
        $(this.frames).each(function(i) {
          return me.ocarousel_container.appendChild(this);
        });
        this.ocarousel_window.html("");
        $(this.ocarousel_window).get(0).appendChild(this.ocarousel_container);
        $(this.ocarousel).show();
        if (indicators_container.length && document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")) {
          indicators_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          indicators_svg.setAttribute("version", "1.1");
          $(indicators_container).get(0).appendChild(indicators_svg);
          this.indicators = [];
          cx = $(indicators_container).width() / 2 - this.settings.indicator_r * this.frames.length - this.settings.indicator_spacing * this.frames.length / 2;
          for (i = 0, _ref13 = this.frames.length - 1; 0 <= _ref13 ? i <= _ref13 : i >= _ref13; 0 <= _ref13 ? i++ : i--) {
            indicator = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            indicator.className = "ocarousel_link";
            indicator.setAttribute("data-ocarousel-link", i);
            indicator.setAttribute("cx", cx);
            indicator.setAttribute("cy", this.settings.indicator_cy);
            indicator.setAttribute("r", this.settings.indicator_r);
            indicator.setAttribute("stroke", this.settings.indicator_stroke);
            indicator.setAttribute("stroke-width", this.settings.indicator_strokewidth);
            indicator.setAttribute("fill", i === 0 ? this.settings.indicator_stroke : this.settings.indicator_fill);
            indicators_svg.appendChild(indicator);
            this.indicators.push(indicator);
            $(indicator).data("ocarousel_index", i);
            cx = cx + this.settings.indicator_r * 2 + this.settings.indicator_spacing;
          }
        }
        $(this.ocarousel).find("[data-ocarousel-link]").click(function(event) {
          var goHere;
          event.preventDefault();
          goHere = $(this).data("ocarousel-link");
          if (goHere != null) {
            if (goHere === "left" || goHere === "Left" || goHere === "l" || goHere === "L") {
              goHere = me.getPrev();
            } else if (goHere === "right" || goHere === "Right" || goHere === "r" || goHere === "R") {
              goHere = me.getNext();
            } else if (goHere === "first" || goHere === "First" || goHere === "beginning" || goHere === "Beginning") {
              goHere = 0;
            } else if (goHere === "last" || goHere === "Last" || goHere === "end" || goHere === "End") {
              goHere = me.frames.length - 1;
            }
            return me.scrollTo(goHere);
          }
        });
        this.timerStart();
      }
    }

    /* Animate a transition to the given position
    */

    Ocarousel.prototype.scrollTo = function(i) {
      var me, nextPos, perEnd, wrapEnd;
      me = this;
      if (i != null) {
        clearInterval(this.timer);
        if (i >= (this.frames.length - this.settings.wrapearly)) {
          i = 0;
        } else if (i >= (this.frames.length - this.settings.perscroll)) {
          i = this.frames.length - this.settings.perscroll;
        } else if (i < 0) {
          perEnd = this.frames.length - this.settings.perscroll;
          wrapEnd = this.frames.length - 1 - this.settings.wrapearly;
          i = Math.min(perEnd, wrapEnd);
        }
        $(this.ocarousel_container).stop();
        if (this.settings.transition === "fade") {
          nextPos = me.getPos(i);
          $(this.ocarousel_container).fadeOut(this.settings.speed, null, function() {
            $(me.ocarousel_container).animate({
              right: nextPos + "px"
            }, 0);
            return $(me.ocarousel_container).fadeIn(me.settings.speed);
          });
        } else {
          $(this.ocarousel_container).animate({
            right: (this.getPos(i)) + "px"
          }, this.settings.speed);
        }
        if (this.indicators != null) {
          $(this.indicators[this.active]).attr("fill", this.settings.indicator_fill);
          $(this.indicators[i]).attr("fill", this.settings.indicator_stroke);
        }
        this.active = i;
        return this.timerStart();
      }
    };

    /* Returns the distance of a frame from the left edge of its container
    */

    Ocarousel.prototype.getPos = function(which) {
      return $(this.frames[which]).position().left;
    };

    /* Returns the index of the next slide that should be shown
    */

    Ocarousel.prototype.getNext = function() {
      var next;
      next = this.active + this.settings.perscroll;
      if (next > (this.frames.length - this.settings.perscroll) && next < this.frames.length) {
        next = this.frames.length - this.settings.perscroll;
      }
      return next;
    };

    /* Returns the index of the next slide that should be shown before the current position
    */

    Ocarousel.prototype.getPrev = function() {
      var prev;
      prev = this.active - this.settings.perscroll;
      if (prev < 0 && this.active !== 0) prev = 0;
      return prev;
    };

    /* Starts or resumes the scroll timer
    */

    Ocarousel.prototype.timerStart = function() {
      var me;
      me = this;
      if (this.settings.period !== "Infinity") {
        return this.timer = setInterval((function() {
          return me.scrollTo(me.getNext());
        }), this.settings.period);
      }
    };

    return Ocarousel;

  })();

  $(document).ready(function() {
    return $(".ocarousel").each(function() {
      return new Ocarousel(this);
    });
  });

}).call(this);
