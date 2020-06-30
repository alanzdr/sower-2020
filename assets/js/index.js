"use strict";

document.addEventListener("DOMContentLoaded", function () {
  handleWithMenu();
});

function handleWithMenu() {
  var active = false;
  var body = document.querySelector('body');
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