/*global
  joScreen: false,
  joCard: false,
  joContainer: false,
  joNavbar: false,
  joStack: false,
  joToolbar: false,
  joScroller: false,
  joScrollbar: false
 */
/**
 * @fileOverview
 * This is a simple example showing how to set up a joScroller with a
 * joScrollbar.
 *
 * Note that in a real application, you must set things up such that
 * scrollbar.calibrate() is called whenever device orientation changes
 * from portrait to landscape or vice versa.
 */

var screen, nav, stack, tabBar, scrollbar;

screen = new joScreen(
  new joContainer([
    nav = new joNavbar(),
    stack = new joStack(),
    tabBar = new joToolbar([
      "Some buttons would usually go here."
    ])
  ]).setStyle({position: "absolute", top: "0", left: "0", bottom: "0", right: "0"})
);
nav.setStack(stack);
stack.push(
  new joScroller([
    new joCard([
      "Typically a bunch of content objects are defined here."
    ])
  ]).setTitle("View Title to Appear in Nav").addScrollbar(
    scrollbar = new joScrollbar({
      // iOS-sized tab bar.
      tabBarHeight: 59
    })
  )
);
scrollbar.calibrate();
