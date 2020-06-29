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

function animationControll () {
  const animate = () => {
    console.log('animate')
  }
  return {
    animate
  }
}

function smoothScroll (speed, smooth) {
  let moving = false;
  let reseted = false;
  const requestFrame = animationFrame();
  
  const target = (document.scrollingElement 
    || document.documentElement 
    || document.body.parentNode 
    || document.body
  )
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
    
		if (Math.abs(delta) > 0.5)
			requestFrame(update)
		else
			moving = false
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
  const scrollSpeed = 140;
  const scrollSmoth = 16;
  const smooth = smoothScroll(scrollSpeed, scrollSmoth)
  const animation = animationControll();

  const move = (event) => {
    event.preventDefault();
    smooth.scroll(event);
  }

  const commum = (event) => {
    animation.animate();
    if (event.type === 'mousedown') {
      if((event.clientX + 7) >= event.target.clientWidth) {
        event.preventDefault();
        event.stopPropagation();
        smooth.reset();
      };
      return;
    }
    if (smooth.isMoving()) {
      event.stopPropagation();
      event.preventDefault();
    } else {
      smooth.reset();
    }
  }

  const onKeyDown = (event) => {
    const code = event.keyCode;
    if (code === 38 || code === 40) {
      smooth.reset();
    }
  }

  const navigationScroll = () => {
    const links = document.querySelectorAll('.navigate');
    links.forEach(link => {
      console.log(link);
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
    window.addEventListener('scroll', commum )
    window.addEventListener('mousedown', commum )
    window.addEventListener("keydown", onKeyDown );
    navigationScroll();
  }

  return { startEvents }
}

const scrollSystem = systemControl();

document.addEventListener("DOMContentLoaded", function () {
  scrollSystem.startEvents();
});