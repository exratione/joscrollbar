A Scrollbar for the Jo Mobile App Framework
===========================================

One of the reasons to choose Jo as an HTML5 mobile application framework is
that it does a good job of using CSS3 transforms to replicate the user
experience of native view scrolling. That's a sufficently fiddly and annoying
line item that even if you're not using Jo you should definitely reference the
code in joScroller rather than try to do it yourself.

One thing that core Jo lacks is a scrollbar component, however, hence this
small project.

You can add a joScrollbar to any joScroller component as shown in the simple
example below:

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

You must ensure that the calibrate() method is invoked whenever the mobile
device orientation changes from portrait to landscape or vice versa.

