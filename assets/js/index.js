"use strict";

document.addEventListener("DOMContentLoaded", function () {
  handleWithMenu();
  handleWithForm();
  handleWithInputsAnimations(); // console.log(scrollSystem);
});

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
}

function handleWithForm() {
  var form = document.getElementById('contact-form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    return false;
  });
}

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
}