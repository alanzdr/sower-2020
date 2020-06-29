"use strict";

function animationFrame() {
  var timeoutFuncion = function timeoutFuncion(func) {
    window.setTimeout(func, 1000 / 50);
  };

  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || timeoutFuncion;
}

function animationControll() {
  var animate = function animate() {
    console.log('animate');
  };

  return {
    animate: animate
  };
}

function smoothScroll(speed, smooth) {
  var moving = false;
  var reseted = false;
  var requestFrame = animationFrame();
  var target = document.scrollingElement || document.documentElement || document.body.parentNode || document.body;
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
    target.scrollTop += delta;
    if (Math.abs(delta) > 0.5) requestFrame(update);else moving = false;
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
  var scrollSpeed = 140;
  var scrollSmoth = 16;
  var smooth = smoothScroll(scrollSpeed, scrollSmoth);
  var animation = animationControll();

  var move = function move(event) {
    event.preventDefault();
    smooth.scroll(event);
  };

  var commum = function commum(event) {
    animation.animate();

    if (event.type === 'mousedown') {
      if (event.clientX + 7 >= event.target.clientWidth) {
        event.preventDefault();
        event.stopPropagation();
        smooth.reset();
      }

      ;
      return;
    }

    if (smooth.isMoving()) {
      event.stopPropagation();
      event.preventDefault();
    } else {
      smooth.reset();
    }
  };

  var onKeyDown = function onKeyDown(event) {
    var code = event.keyCode;

    if (code === 38 || code === 40) {
      smooth.reset();
    }
  };

  var navigationScroll = function navigationScroll() {
    var links = document.querySelectorAll('.navigate');
    links.forEach(function (link) {
      console.log(link);
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
    window.addEventListener('scroll', commum);
    window.addEventListener('mousedown', commum);
    window.addEventListener("keydown", onKeyDown);
    navigationScroll();
  };

  return {
    startEvents: startEvents
  };
}

var scrollSystem = systemControl();
document.addEventListener("DOMContentLoaded", function () {
  scrollSystem.startEvents();
});