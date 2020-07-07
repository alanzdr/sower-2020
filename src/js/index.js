document.addEventListener("DOMContentLoaded", function () {
  // MENU
  handleWithMenu();
  // FORM CONTROL
  handleWithForm();
  // INPUT ANIMATIONS
  handleWithInputsAnimations();
  // HANDS ANIMATION
  handleWithHandsAnimation();
});

// MENU
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

// FORM CONTROL
function handleWithForm () {
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    return false;
  })
}

// INPUT ANIMATIONS
function handleWithInputsAnimations () {
  const inputs = document.querySelectorAll('.input-container');

  const setupInput = (inputContainer) =>  {
    const input = inputContainer.querySelector('input');
    const addEvents = (input) => {
      input.addEventListener('focus', (ev) => {
        inputContainer.classList.add("focus");
      })
      input.addEventListener('focusout', (ev) => {
        if (!input.value.length) {
          inputContainer.classList.remove("focus");
        }
      })
    }
    if (!input) {
      const textarea = inputContainer.querySelector('textarea');
      if (textarea) {
        addEvents(textarea);
      }
      return;
    }
    addEvents(input);
  }

  inputs.forEach(setupInput)
}

// HANDS ANIMATION
function handleWithHandsAnimation() {
  const container = document.getElementById('hands-container');

  const leftHand = container.querySelector('.left');
  const leftLowShadow = leftHand.querySelector('.low-shadow')
  const leftHighShadow = leftHand.querySelector('.high-shadow')

  const rightHand = container.querySelector('.right');
  const rightLowShadow = rightHand.querySelector('.low-shadow')
  const rightHighShadow = rightHand.querySelector('.high-shadow')

  const getDistanceRate = (distance) => {
    const rateMax = 500;
    if (distance > rateMax) {
      return 0;
    }
    if (distance <= 0) {
      return 1;
    }
    return (distance / -rateMax) + 1;
  }

  const setHandTransform = (rate) => {
    const percent = (1 - rate) * 100;
    leftHand.style.transform = `translate(-${percent}%, -${percent}px)`
    rightHand.style.transform = `translate(${percent}%, ${percent}px)`
  }

  const setLowShadow = (rate) => {
    let opacity = (rate - 0.5) / 0.5;
    if (opacity < 0) opacity = 0;
    leftLowShadow.style.opacity = opacity;
    rightLowShadow.style.opacity = opacity;
  }

  const setHighShadow = (rate) => {
    let opacity = (rate - 0.75) / 0.5;
    if (opacity < 0) opacity = 0;
    leftHighShadow.style.opacity = opacity;
    rightHighShadow.style.opacity = opacity;
  }

  scrollSystem.animate(container, (visible, focus, distance) => {
    const rate = getDistanceRate(distance);
    if (rate !== 0) {
      setHandTransform(rate);
      setLowShadow(rate);
      setHighShadow(rate);
    }
  })
}