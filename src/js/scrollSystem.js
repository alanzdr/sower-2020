function smoothScroll (speed, smooth) {
  let moving = false;
  let reseted = false;
  
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
		} else
			return event.wheelDelta / 120 // IE,Safari,Chrome
  }

  const animationFrame = () => {
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

  const requestFrame = (func) => { // requestAnimationFrame cross browser
    const functionFrame = animationFrame();
    functionFrame(func);
	}
  
  const update = () => {
    
    if (reseted) {
      moving = false;
      console.log('reseted');
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

  const scrolled = (event) => {
    const delta = normalizeWheelDelta(event);
    position += -delta * speed;
    position = Math.max(0, Math.min(position, target.scrollHeight - frame.clientHeight))
    reseted = false;
    if ( !moving ) update()
  }

  const reset = () => {
    console.log('reset');
    reseted = true;
    position = target.scrollTop;
  }

  return {
    scroll: scrolled,
    reset
  }
}

function systemControl () {
  const smooth = smoothScroll(140, 16)
  const wheel = (event) => {
    event.preventDefault();
    smooth.scroll(event);
  }
  const stop = () => {
    smooth.reset();
  }
  return {
    stop,
    wheel
  }
}

function eventObserver () {
  console.log('eventObserver');
  const scrollSystem = systemControl();
  // window.onwheel = wheel;
  window.addEventListener('wheel', scrollSystem.wheel, {
    passive: false
  });
  window.addEventListener('mousewheel', scrollSystem.wheel, { 
    passive: false 
  })
	window.addEventListener('DOMMouseScroll', scrollSystem.wheel, { 
    passive: false 
  })

  const onKeyPress = (event) => {
    const code = event.keyCode;
    if (code === 38 || code === 40) {
      scrollSystem.stop();
    }
  }

  window.addEventListener("keydown", onKeyPress);
}

document.addEventListener("DOMContentLoaded", function () {
  console.log('DOMContentLoaded');
  eventObserver();
});