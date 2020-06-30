"use strict";

function animationFrame() {
  var timeoutFuncion = function timeoutFuncion(func) {
    window.setTimeout(func, 1000 / 50);
  };

  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || timeoutFuncion;
}

function animationControll(target, margin) {
  var items = document.querySelectorAll('.animated');
  var animations = [];

  var readAnimation = function readAnimation(item) {
    return animations.find(function (value) {
      return value.item === item;
    });
  };

  var addAnimation = function addAnimation(item, cb) {
    var animation = {
      item: item,
      animate: cb
    };
    animations.push(animation);
  };

  var animate = function animate() {
    var position = target.scrollTop;
    var animationFocus = position + window.innerHeight / 2 - 80;
    var animationVisible = position + window.innerHeight - margin;
    items.forEach(function (item) {
      var top = item.offsetTop;
      var visible = top <= animationVisible;
      var distance = top - animationFocus;
      var focus = top <= animationFocus;
      item.dataset.distance = distance;
      item.dataset.visible = visible;
      item.dataset.focus = focus;

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
    });
  };

  return {
    animate: animate,
    add: addAnimation
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
      if (event.wheelDelta) return event.wheelDelta / 120;
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
    console.log(delta);
    target.scrollTop += delta;
    if (Math.abs(delta) > 1) requestFrame(update);else {
      moving = false; // target.scrollTop = position
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

  var isMoving = function isMoving() {
    return moving;
  };

  return {
    scroll: scrolled,
    reset: reset,
    isMoving: isMoving
  };
}

function systemControl() {
  var scrollSpeed = 120;
  var scrollSmoth = 18;
  var animationMargin = window.innerHeight / 5;
  var target = document.scrollingElement || document.documentElement || document.body.parentNode || document.body;
  var smooth = smoothScroll(target, scrollSpeed, scrollSmoth);
  var animation = animationControll(target, animationMargin);

  var move = function move(event) {
    // console.log('move');
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
    } // console.log(event);


    event.preventDefault();

    if (smooth.isMoving()) {
      event.preventDefault();
      return false;
    } else {
      smooth.reset();
    }
  };

  var onKeyDown = function onKeyDown(event) {
    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    console.log(event);
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

  var navigationScroll = function navigationScroll() {
    var links = document.querySelectorAll('.navigate');
    links.forEach(function (link) {
      var itemId = link.dataset.href;
      var item = document.getElementById(itemId);

      if (item) {
        link.addEventListener('click', function () {
          smooth.reset();
          item.scrollIntoView({
            behavior: 'smooth'
          });
        });
      }
    });
  };

  var startEvents = function startEvents() {
    window.addEventListener('wheel', move, {
      passive: false
    });
    window.addEventListener('mousewheel', move, {
      passive: false
    });
    window.addEventListener('DOMMouseScroll', commum, false);
    window.addEventListener('touchmove', commum, {
      passive: false
    });
    window.addEventListener('scroll', commum, false);
    window.addEventListener('mousedown', commum);
    window.addEventListener("keydown", onKeyDown, false);
  };

  var init = function init() {
    startEvents();
    navigationScroll();
    animation.animate();
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