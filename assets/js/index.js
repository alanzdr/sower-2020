"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // MENU
  handleWithMenu(); // FORM CONTROL

  handleWithForm(); // INPUT ANIMATIONS

  handleWithInputsAnimations(); // HANDS ANIMATION

  handleWithHandsAnimation();
}); // MENU

function handleWithMenu() {
  var active = false; // const body = document.querySelector('body')

  var header = document.querySelector('header');
  var hamburger = document.getElementById('header-hamburguer');
  var menuNavigator = document.querySelector('#menu-navigation');
  var menuItems = document.querySelectorAll('#menu-navigation li');

  var handleWithOpenOrCloseMenu = function handleWithOpenOrCloseMenu() {
    if (active) {
      // body.classList.add('disabled')
      header.classList.add('active');
      hamburger.classList.add('is-active');
      menuNavigator.classList.remove("disappear");
    } else {
      menuNavigator.classList.add("disappear"); // body.classList.remove('disabled')

      header.classList.remove('active');
      hamburger.classList.remove('is-active');
    }
  };

  menuItems.forEach(function (item) {
    item.addEventListener('click', function () {
      active = false;
      handleWithOpenOrCloseMenu();
    });
  });
  hamburger.addEventListener('click', function () {
    active = !active;
    handleWithOpenOrCloseMenu();
  });
} // FORM CONTROL


function handleWithForm() {
  var form = document.getElementById('contact-form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    return false;
  });
} // INPUT ANIMATIONS


function handleWithInputsAnimations() {
  var inputs = document.querySelectorAll('.input-container');

  var setupInput = function setupInput(inputContainer) {
    var input = inputContainer.querySelector('input');

    var addEvents = function addEvents(input) {
      input.addEventListener('focus', function (ev) {
        inputContainer.classList.add("focus");
      });
      input.addEventListener('focusout', function (ev) {
        if (!input.value.length) {
          inputContainer.classList.remove("focus");
        }
      });
    };

    if (!input) {
      var textarea = inputContainer.querySelector('textarea');

      if (textarea) {
        addEvents(textarea);
      }

      return;
    }

    addEvents(input);
  };

  inputs.forEach(setupInput);
} // HANDS ANIMATION


function handleWithHandsAnimation() {
  var container = document.getElementById('hands-container');
  var leftHand = container.querySelector('.left');
  var leftLowShadow = leftHand.querySelector('.low-shadow');
  var leftHighShadow = leftHand.querySelector('.high-shadow');
  var rightHand = container.querySelector('.right');
  var rightLowShadow = rightHand.querySelector('.low-shadow');
  var rightHighShadow = rightHand.querySelector('.high-shadow');
  var rateMax = window.innerHeight;
  console.log(rateMax); // const animationMargin = window.innerHeight / 3;

  var getDistanceRate = function getDistanceRate(distance) {
    if (distance > rateMax) {
      return 0;
    }

    if (distance <= 0) {
      return 1;
    }

    return distance / -rateMax + 1;
  };

  var setHandTransform = function setHandTransform(rate) {
    var percent = (1 - rate) * 100;
    leftHand.style.transform = "translate(-".concat(percent, "%, -").concat(percent, "px)");
    rightHand.style.transform = "translate(".concat(percent, "%, ").concat(percent, "px)");
  };

  var setLowShadow = function setLowShadow(rate) {
    var opacity = (rate - 0.5) / 0.5;
    if (opacity < 0) opacity = 0;
    leftLowShadow.style.opacity = opacity;
    rightLowShadow.style.opacity = opacity;
  };

  var setHighShadow = function setHighShadow(rate) {
    var opacity = (rate - 0.75) / 0.5;
    if (opacity < 0) opacity = 0;
    leftHighShadow.style.opacity = opacity;
    rightHighShadow.style.opacity = opacity;
  };

  scrollSystem.animate(container, function (visible, focus, distance) {
    var rate = getDistanceRate(distance);

    if (rate !== 0) {
      setHandTransform(rate);
      setLowShadow(rate);
      setHighShadow(rate);
    }
  });
}