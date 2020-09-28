
function supportCalculate () {
  if (!self.fetch) return false;
  if (!Number.isInteger) return false;
  return true;
}

let highSupport = supportCalculate();

if (!highSupport) {
  const body = document.querySelector('body');
  body.classList.add('low-support');
}

document.addEventListener("DOMContentLoaded", function () {
  // MENU
  handleWithMenu();
  // FORM CONTROL
  handleWithForm();
  // INPUT ANIMATIONS
  handleWithInputsAnimations();
  // HANDS ANIMATION
  handleWithHandsAnimation();
  // VIDEO
  handleWithVideoContainer();
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

  for (let i = 0; i < menuItems.length; i++) {
    const item = menuItems[i]
    item.addEventListener('click', () => {
      active = false;
      handleWithOpenOrCloseMenu();
    });
  }

  hamburger.addEventListener('click', () => {
    active = !active;
    handleWithOpenOrCloseMenu();
  })
}

// FORM CONTROL
function handleWithForm () {
  const form = document.getElementById('contact-form');
  const button = form.querySelector('button')
  const API_URL = 'https://us-central1-sower-283917.cloudfunctions.net/sower-webmail-send';

  const getFormData = () => {
    const data = {};
    const elements = form.elements;
    for ( let x = 0; x < elements.length; x++ ) {
      const input = elements[x];
      if (input.type != 'submit') {
        let key = "";
        if (input.name)
          key = input.name
        data[key] = input.value;
      }
    }
    return data;
  }

  const fetchSend = (url, data, cb) => {
    if (highSupport) {
      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(cb)
        .catch(err => {
          console.log(err);
        })
    } else {
      const req = new XMLHttpRequest();
      req.open('POST', url, false);
      req.setRequestHeader("Content-Type", "application/json");
      req.onload = cb;
      req.send(JSON.stringify(data));
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    button.setAttribute('disabled', true);
    const data = getFormData();
    fetchSend(API_URL, data, () => {
      button.removeAttribute('disabled');
      alert('Obrigado, Em breve o entraremos em contato com você')
    })
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

  for (let i = 0; i < inputs.length; i++) {
    setupInput(inputs[i]);
  }
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
  
  const rateMax = window.innerHeight;
  console.log(rateMax);
  // const animationMargin = window.innerHeight / 3;

  const getDistanceRate = (distance) => {
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

// VIDEO
function handleWithVideoContainer() {
  const container = document.getElementById("video-container");
  const video = container.querySelector("iframe");
  const play = document.getElementById("video-play");
  const videoSrc = "https://www.youtube.com/embed/k4nF4sMOayE";
  const undefinedParam = "https://10.0.0.0/";

  const onSetSrc = () => {
    setTimeout(() => {
      if (!video.src || video.src === undefinedParam) {
        video.src = videoSrc;
      }
    }, 1000);
  };

  const onSetup = () => {
    play.addEventListener("click", onOpen);
    container.addEventListener("click", () => {
      onClose();
    });
    onSetSrc();
  };

  const onClose = () => {
    container.classList.remove("open");
    document.body.style.overflow = "auto";
    video.src = undefinedParam;
    onSetSrc();
  };

  const onOpen = () => {
    container.classList.add("open");
    document.body.style.overflow = "hidden";
    if (!video.src || video.src === undefinedParam) {
      video.src = videoSrc;
    }
  };

  onSetup();
}