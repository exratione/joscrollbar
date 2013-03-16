/*global
  joDOM: false,
  joScroller: false,
  joView: false,
  window: false
 */
/**
 * @fileOverview
 * The joScrollbar component adds elements that form a scrollbar to a joScroller.
 */

/**
 * The joScrollbar component adds elements that form a scrollbar to a joScroller.
 * The optional options object can contain:
 *
 * {
 *   // Is there a tab bar in the app? If so, give the height in pixels.
 *   // 59px is the height of the tab bar in iOS.
 *   tabBarHeight: number | false,
 *   // Defaults to 0.75 for an old-style iPhone. Needed to tinker the
 *   // joscrollbar to fit well - try altering it if yours doesn't.
 *   portraitHeightFactor: 0.75,
 *   // Defaults to 0.65 for an old-style iPhone. Needed to tinker the
 *   // joscrollbar to fit well - try altering it if yours doesn't.
 *   landscapeHeightFactor: 0.65
 * }
 *
 * @param {object} [options]
 *   Options.
 */
var joScrollbar = function (options) {
  joView.call(this);

  options = options || {};
  options.portraitHeightFactor = options.portraitHeightFactor || 0.75;
  options.landscapeHeightFactor = options.landscapeHeightFactor || 0.65;
  this.options = options;

  this.scroller = null;
  this.calibrate();
};
joScrollbar.extend(joView, {
  tagName: "joscrollbar",

  createContainer: function() {
    var o = joDOM.create(this.tagName);
    if (o) {
      o.setAttribute("tabindex", "1");
    }
    var w = joDOM.create("joscrollbarpadding");
    o.appendChild(w);
    var s = joDOM.create("joscrollbarslider");
    w.appendChild(s);
    this.slider = s;
    return o;
  },

  /*
   * Move the scrollbar slider.
   *
   * @param {number} scaledPosition
   *   How far to move expressed as a fraction of visible page size/scrollbar
   *   size.
   */
  setSliderPosition: function (scaledPosition) {
    var y = -1 * Math.floor(scaledPosition * this.slider.clientHeight);
    this.slider.style.webkitTransform = "translate3d(0, " + y + "px, 0)";
  },

  /*
   * We must size the scrollbar correctly: this function must be called
   * after the scrollbar is inserted into the DOM, and every time the
   * page changes size - e.g. on orientation change.
   *
   * It sets the height of the joScrollbar to a useful size, and sets the
   * relative height of the inner slider by looking at the window and
   * viewport height.
   */
  calibrate: function () {
    if (!this.scroller) {
      return;
    }

    // Find the jocard element so we can measure its height.
    var view;
    for (var i = 0, l = this.scroller.container.children.length; i < l; i++) {
      if (this.scroller.container.children[i].tagName === "JOCARD") {
        view = this.scroller.container.children[i];
        break;
      }
    }
    if (!view) {
      // The thing is not in the DOM yet, so do nothing.
      return;
    }

    var viewportHeight = window.innerHeight;
    var viewportWidth = window.innerWidth;
    var viewHeight = view.clientHeight;

    if (this.options.tabBarHeight && typeof this.options.tabBarHeight === "number") {
      // If you are replicating the tabBar with a joToolbar, then you must
      // account for its height in figuring this lot out, otherwise you'll be
      // noticably off.
      viewHeight -= this.options.tabBarHeight;
    }

    // Some fudge factors to get the scrollbar entirely in the visible page,
    // below the header and above the footer.
    var heightFactor;
    if (viewportHeight > viewportWidth) {
      heightFactor = this.options.portraitHeightFactor;
    } else {
      heightFactor = this.options.landscapeHeightFactor;
    }

    var setHeight = Math.floor(viewportHeight * heightFactor);
    this.container.style.height = "" + setHeight + "px";
    this.container.firstChild.style.height = "" + (setHeight - 10) + "px";

    var scrollerHeight = this.container.clientHeight;
    var sliderHeight = Math.floor(
      viewportHeight * (scrollerHeight - 10) / viewHeight
    );
    this.slider.style.height = "" + sliderHeight + "px";

    if (sliderHeight < scrollerHeight - 10) {
      this.setStyle("active");
    } else {
      this.setStyle("inactive");
    }
  }
});

// -----------------------------------------------------------------
// Extend joScroller to allow adding of a scrollbar.
// -----------------------------------------------------------------

/*
 * A convenience method: give this joScroller a scrollbar. It only works if
 * there are already contents, as making a scrollbar the first child of the
 * container node would cause interesting undesirable behavior.
 *
 * @param {joScrollbar} joscrollbar
 *   A joScrollbar instance.
 */
joScroller.prototype.addScrollbar = function (joscrollbar) {
  if (this.container.firstChild && joscrollbar instanceof joScrollbar) {
    this.push(joscrollbar);
    this.scrollbar = joscrollbar;
    joscrollbar.scroller = this;
  }
  return this;
};

joScroller.prototype.originalSetPosition = joScroller.prototype.setPosition;

/**
 * Amend the joScroller setPosition method so that it also moves the scrollbar
 * appropriately.
 */
joScroller.prototype.setPosition = function(x, y, node) {
  if (this.scrollbar) {
    var scaled = y / window.innerHeight;
    this.scrollbar.setSliderPosition(scaled);
  }
  return this.originalSetPosition(x, y, node);
};
