"use strict";

function supportCalculate() {
  if (!self.fetch) return false;
  if (!Number.isInteger) return false;
  return true;
}

var highSupport = supportCalculate();

if (!highSupport) {
  var body = document.querySelector('body');
  body.classList.add('low-support');
}

document.addEventListener("DOMContentLoaded", function () {
  // MENU
  handleWithMenu(); // FORM CONTROL

  handleWithForm(); // INPUT ANIMATIONS

  handleWithInputsAnimations(); // HANDS ANIMATION

  handleWithHandsAnimation(); // VIDEO

  handleWithVideoContainer();
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

  for (var i = 0; i < menuItems.length; i++) {
    var item = menuItems[i];
    item.addEventListener('click', function () {
      active = false;
      handleWithOpenOrCloseMenu();
    });
  }

  hamburger.addEventListener('click', function () {
    active = !active;
    handleWithOpenOrCloseMenu();
  });
} // FORM CONTROL


function handleWithForm() {
  var form = document.getElementById('contact-form');
  var button = form.querySelector('button');
  var API_URL = 'https://us-central1-sower-283917.cloudfunctions.net/sower-webmail-send';

  var getFormData = function getFormData() {
    var data = {};
    var elements = form.elements;

    for (var x = 0; x < elements.length; x++) {
      var input = elements[x];

      if (input.type != 'submit') {
        var key = "";
        if (input.name) key = input.name;
        data[key] = input.value;
      }
    }

    return data;
  };

  var fetchSend = function fetchSend(url, data, cb) {
    if (highSupport) {
      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(cb).catch(function (err) {
        console.log(err);
      });
    } else {
      var req = new XMLHttpRequest();
      req.open('POST', url, false);
      req.setRequestHeader("Content-Type", "application/json");
      req.onload = cb;
      req.send(JSON.stringify(data));
    }
  };

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    button.setAttribute('disabled', true);
    var data = getFormData();
    fetchSend(API_URL, data, function () {
      button.removeAttribute('disabled');
      alert('Obrigado, Em breve o entraremos em contato com você');
    });
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

  for (var i = 0; i < inputs.length; i++) {
    setupInput(inputs[i]);
  }
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
} // VIDEO


function handleWithVideoContainer() {
  var container = document.getElementById("video-container");
  var video = container.querySelector("iframe");
  var play = document.getElementById("video-play");
  var videoSrc = "https://www.youtube.com/embed/k4nF4sMOayE";
  var undefinedParam = "https://10.0.0.0/";

  var onSetSrc = function onSetSrc() {
    setTimeout(function () {
      if (!video.src || video.src === undefinedParam) {
        video.src = videoSrc;
      }
    }, 1000);
  };

  var onSetup = function onSetup() {
    play.addEventListener("click", onOpen);
    container.addEventListener("click", function () {
      onClose();
    });
    onSetSrc();
  };

  var onClose = function onClose() {
    container.classList.remove("open");
    document.body.style.overflow = "auto";
    video.src = undefinedParam;
    onSetSrc();
  };

  var onOpen = function onOpen() {
    container.classList.add("open");
    document.body.style.overflow = "hidden";

    if (!video.src || video.src === undefinedParam) {
      video.src = videoSrc;
    }
  };

  onSetup();
}