function animationFrame () {
  const timeoutFuncion = (func) => {
    window.setTimeout(func, 1000 / 50);
  }
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    timeoutFuncion
  );
}

function animationControll (target, margin) {
  const items = document.querySelectorAll('.animated');
  const animations = [];

  const readAnimation = (item) => {
    return animations.find((value) => value.item === item)
  }

  const addAnimation = (item, cb) => {
    const animation = {
      item,
      animate: cb
    }
    animations.push(animation);
  }

  const animate = () => {
    const position = target.scrollTop;
    const animationFocus = position + (window.innerHeight / 2) - 80; 
    const animationVisible = position + window.innerHeight - margin; 

    items.forEach(item => {
      const top = position + item.getBoundingClientRect().top;
      
      const distance = top - animationFocus;
      const visible = top <= animationVisible;
      const focus = top <= animationFocus;
      
      item.dataset.top = top;
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

      const animation = readAnimation(item);
      if (animation) {
        animation.animate(visible, focus, distance)
      }
    })
  }

  return {
    animate,
    add: addAnimation
  }
}

function smoothScroll (target, speed, smooth) {
  let moving = false;
  let reseted = false;
  const requestFrame = animationFrame();
 
  const frame = target === document.body 
    && document.documentElement 
    ? document.documentElement 
    : target

  let position = target.scrollTop;

  const normalizeWheelDelta = (event) => {
		if (event.detail) {
			if (event.wheelDelta)
				return event.wheelDelta / event.detail / 40 * (event.detail > 0 ? 1 : -1 ) // Opera
			else 
				return -event.detail / 3 // Firefox
    } else { // IE,Safari,Chrome
      if (event.wheelDelta) return event.wheelDelta / 120;
      else if (event.deltaY >= -3 && event.deltaY <= 3) 
        return -event.deltaY / 3
      return -event.deltaY / 50
    }
  }
  
  const update = () => {
    if (reseted) {
      moving = false;
      return;
    }
    
    moving = true
    const delta = (position - target.scrollTop) / smooth   

    target.scrollTop += delta
    
		if (Math.abs(delta) > 1)
			requestFrame(update)
		else {
			moving = false
    }
  }

  const reset = () => {
    reseted = true;
  }

  const scrolled = (event) => {
    if (reseted) {
      position = target.scrollTop;
      reseted = false;
    }
    const delta = normalizeWheelDelta(event);
    position += -delta * speed;
    position = Math.max(0, Math.min(position, target.scrollHeight - frame.clientHeight))

    if ( !moving ) update()
  }

  const isMoving = () => {
    return moving;
  } 

  return {
    scroll: scrolled,
    reset,
    isMoving
  }
}

function systemControl () {
  const scrollSpeed = 100;
  const scrollSmoth = 20;
  const animationMargin = window.innerHeight / 3;
   
  const target = (document.scrollingElement 
    || document.documentElement 
    || document.body.parentNode 
    || document.body
  )

  const smooth = smoothScroll(target, scrollSpeed, scrollSmoth)
  const animation = animationControll(target, animationMargin);

  const move = (event) => {
    event.preventDefault();
    smooth.scroll(event);
  }

  const commum = (event) => {
    animation.animate();
    if (event.type === 'mousedown') {
      if (event.button === 0) {
        if((event.clientX + 7) >= event.target.clientWidth) {
          smooth.reset();
        };
      } else if (event.button === 1) {
        smooth.reset();
      }
      return;
    }
    // console.log(event);
    event.preventDefault();
    if (smooth.isMoving()) {
      event.preventDefault();
      return false;
    } else {
      smooth.reset();
    }
  }

  const onKeyDown = (event) => {
    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    const keys = {
      37: true, 
      38: true, 
      39: true, 
      40: true,
      32: true,
      33: true,
      34: true,
      35: true,
      36: true,
    };
    const code = event.keyCode;
    if (keys[code]) {
      smooth.reset();
      return false;
    }
  }

  const navigationScroll = () => {
    const links = document.querySelectorAll('.navigate');
    links.forEach(link => {
      const itemId = link.dataset.href;
      const item = document.getElementById(itemId);
      if (item) {
        link.addEventListener('click', () => {
          smooth.reset();
          item.scrollIntoView({ 
            behavior: 'smooth' 
          });
        })
      }
    })
  }

  const startEvents = () => {
    window.addEventListener('wheel', move, {
      passive: false
    });
    window.addEventListener('mousewheel', move, { 
      passive: false 
    })
    window.addEventListener('DOMMouseScroll', commum, false)
    window.addEventListener('scroll', commum, false)
    window.addEventListener('mousedown', commum )
    window.addEventListener("keydown", onKeyDown, false );
  }

  const init = () => {
    startEvents();
    navigationScroll();
    animation.animate();
  }

  const animate = (item, cb) => {
    animation.add(item, cb)
  }

  return { 
    init,
    animate
  }
}

const scrollSystem = systemControl();

document.addEventListener("DOMContentLoaded", function () {
  scrollSystem.init();
});