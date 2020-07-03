document.addEventListener("DOMContentLoaded", function () {
  handleWithMenu();
  console.log(scrollSystem);
});

function handleWithMenu () {
  let active = false;

  // const body = document.querySelector('body')
  const header = document.querySelector('header')
  const hamburger = document.getElementById('header-hamburguer');
  const menuNavigator = document.querySelector('#menu-navigation');
  const menuItems = document.querySelectorAll('#menu-navigation li');

  const handleWithOpenOrCloseMenu = () => {
    if (active) {
      // body.classList.add('disabled')
      header.classList.add('active')
      hamburger.classList.add('is-active');
      menuNavigator.classList.remove("disappear")
    } else {
      menuNavigator.classList.add("disappear")
      // body.classList.remove('disabled')
      header.classList.remove('active')
      hamburger.classList.remove('is-active')
    }
  }

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      active = false;
      handleWithOpenOrCloseMenu();
    });
  })

  hamburger.addEventListener('click', () => {
    active = !active;
    handleWithOpenOrCloseMenu();
  })
}