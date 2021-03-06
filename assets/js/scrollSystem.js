"use strict";

function animationFrame() {
  var timeoutFuncion = function timeoutFuncion(func) {
    window.setTimeout(func, 1000 / 50);
  };

  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || timeoutFuncion;
}

function animationControll(target, margin) {
  var debug = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var items = document.querySelectorAll('.animated');
  var animations = [];

  var readAnimation = function readAnimation(item) {
    // let animation = undefined;
    for (var i = 0; i < animations.length; i++) {
      var value = animations[i];
      if (value.item === item) return value;
    }

    return undefined;
  };

  var onAddAnimation = function onAddAnimation(item, cb) {
    var animation = {
      item: item,
      animate: cb
    };
    animations.push(animation);
  };

  var onAnimate = function onAnimate() {
    var position = target.scrollTop;
    var animationFocus = position + window.innerHeight / 2 - 100;
    var animationVisible = position + window.innerHeight - margin;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var top = position + item.getBoundingClientRect().top;
      var distance = top - animationFocus;
      var visible = top <= animationVisible;
      var focus = top <= animationFocus;

      if (debug) {
        item.dataset.top = top;
        item.dataset.distance = distance;
        item.dataset.visible = visible;
        item.dataset.focus = focus;
      }

      if (focus) {
        item.classList.add('focus');
        item.classList.add('visible');
      } else if (visible) {
        item.classList.remove('focus');
        item.classList.add('visible');
      } else {
        item.classList.remove('visible');
        item.classList.remove('focus');
      }

      var animation = readAnimation(item);

      if (animation) {
        animation.animate(visible, focus, distance);
      }
    }
  };

  var onFocusAll = function onFocusAll() {
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      item.classList.add('focus');
      item.classList.add('visible');
    }
  };

  var onRemoveFocusAll = function onRemoveFocusAll() {
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      item.classList.remove('focus');
      item.classList.remove('visible');
    }
  };

  return {
    animate: onAnimate,
    add: onAddAnimation,
    focusAll: onFocusAll,
    removeFocusAll: onRemoveFocusAll
  };
}

function smoothScroll(target, speed, smooth) {
  var moving = false;
  var reseted = false;
  var requestFrame = animationFrame();
  var frame = target === document.body && document.documentElement ? document.documentElement : target;
  var position = target.scrollTop;

  var normalizeWheelDelta = function normalizeWheelDelta(event) {
    if (event.detail) {
      if (event.wheelDelta) return event.wheelDelta / event.detail / 40 * (event.detail > 0 ? 1 : -1); // Opera
      else return -event.detail / 3; // Firefox
    } else {
      // IE,Safari,Chrome
      if (event.wheelDelta) return event.wheelDelta / 120;else if (event.deltaY >= -3 && event.deltaY <= 3) return -event.deltaY / 3;
      return -event.deltaY / 50;
    }
  };

  var update = function update() {
    if (reseted) {
      moving = false;
      return;
    }

    moving = true;
    var delta = (position - target.scrollTop) / smooth;
    target.scrollTop += delta;
    if (Math.abs(delta) > 1) requestFrame(update);else {
      moving = false;
    }
  };

  var reset = function reset() {
    reseted = true;
  };

  var scrolled = function scrolled(event) {
    if (reseted) {
      position = target.scrollTop;
      reseted = false;
    }

    var delta = normalizeWheelDelta(event);
    position += -delta * speed;
    position = Math.max(0, Math.min(position, target.scrollHeight - frame.clientHeight));
    if (!moving) update();
  };

  var scrollTo = function scrollTo(scrollTop) {
    position = scrollTop - 80;
    reseted = false;
    if (!moving) update();
  };

  var isMoving = function isMoving() {
    return moving;
  };

  return {
    scroll: scrolled,
    reset: reset,
    isMoving: isMoving,
    scrollTo: scrollTo
  };
}

function systemControl() {
  var scrollSpeed = 100;
  var scrollSmoth = 20;
  var animationMargin = window.innerHeight / 3;
  var target = document.scrollingElement || document.documentElement || document.body.parentNode || document.body;
  var smooth = smoothScroll(target, scrollSpeed, scrollSmoth);
  var animation = animationControll(target, animationMargin);

  var move = function move(event) {
    event.preventDefault();
    smooth.scroll(event);
  };

  var commum = function commum(event) {
    animation.animate();

    if (event.type === 'mousedown') {
      if (event.button === 0) {
        if (event.clientX + 7 >= event.target.clientWidth) {
          smooth.reset();
        }

        ;
      } else if (event.button === 1) {
        smooth.reset();
      }

      return;
    }

    event.preventDefault();

    if (smooth.isMoving()) {
      event.preventDefault();
      return false;
    } else {
      smooth.reset();
    }
  };

  var onKeyDown = function onKeyDown(event) {
    var keys = {
      37: true,
      38: true,
      39: true,
      40: true,
      32: true,
      33: true,
      34: true,
      35: true,
      36: true
    };
    var code = event.keyCode;

    if (keys[code]) {
      smooth.reset();
      return false;
    }
  };

  var navigationScroll = function navigationScroll(isMobile) {
    var links = document.querySelectorAll('.navigate');
    var eventsCleanup = [];

    var desktopMove = function desktopMove(item) {
      var position = target.scrollTop;
      var top = position + item.getBoundingClientRect().top;
      smooth.scrollTo(top);
    };

    var mobileMove = function mobileMove(item) {
      item.scrollIntoView({
        behavior: "smooth"
      });
    };

    var eventListener = function eventListener(item) {
      if (isMobile) {
        mobileMove(item);
      } else {
        desktopMove(item);
      }
    };

    var _loop = function _loop(i) {
      var link = links[i];
      var itemId = link.dataset.href;
      var item = document.getElementById(itemId);

      if (item) {
        var onEventTricker = function onEventTricker() {
          eventListener(item);
        };

        link.addEventListener('click', onEventTricker);
        eventsCleanup.push(function () {
          link.removeEventListener('click', onEventTricker);
        });
      }
    };

    for (var i = 0; i < links.length; i++) {
      _loop(i);
    }

    var onCleanup = function onCleanup() {
      for (var _i = 0; _i < eventsCleanup.length; _i++) {
        var call = eventsCleanup[_i];

        if (typeof call === 'function') {
          call();
        }
      }
    };

    return onCleanup;
  };

  var startEvents = function startEvents() {
    window.addEventListener('wheel', move, {
      passive: false
    });
    window.addEventListener('mousewheel', move, {
      passive: false
    });
    window.addEventListener('DOMMouseScroll', commum, false);
    window.addEventListener('scroll', commum, false);
    window.addEventListener('mousedown', commum);
    window.addEventListener("keydown", onKeyDown, false);
  };

  var init = function init() {
    var setup = function setup(isMobile) {
      if (!isMobile) {
        startEvents();
        animation.focusAll();
        animation.animate();
      } else {
        animation.removeFocusAll();
      }
    };

    var isMobile = window.innerWidth < 1000;
    setup(isMobile);
    var navigationCleanup = navigationScroll(isMobile);
    console.log(navigationCleanup);
    window.addEventListener("resize", function () {
      var newIsMobile = window.innerWidth < 1000;

      if (isMobile != newIsMobile) {
        setup(newIsMobile);
        navigationCleanup();
        navigationCleanup = navigationScroll(newIsMobile);
      }
    });
  };

  var animate = function animate(item, cb) {
    animation.add(item, cb);
  };

  return {
    init: init,
    animate: animate
  };
}

var scrollSystem = systemControl();
document.addEventListener("DOMContentLoaded", function () {
  scrollSystem.init();
});