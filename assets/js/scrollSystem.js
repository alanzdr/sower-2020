"use strict";function smoothScroll(a,b){var c=!1,d=!1,e=document.scrollingElement||document.documentElement||document.body.parentNode||document.body,f=e===document.body&&document.documentElement?document.documentElement:e,g=e.scrollTop,h=a=>a.detail?a.wheelDelta?a.wheelDelta/a.detail/40*(0<a.detail?1:-1):-a.detail/3:a.wheelDelta/120,i=()=>{return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||(a=>{window.setTimeout(a,20)})},j=a=>{// requestAnimationFrame cross browser
var b=i();b(a)},k=()=>{if(d)return c=!1,void console.log("reseted");c=!0;var a=(g-e.scrollTop)/b;e.scrollTop+=a,.5<Math.abs(a)?j(k):c=!1},l=b=>{var i=h(b);g+=-i*a,g=Math.max(0,Math.min(g,e.scrollHeight-f.clientHeight)),d=!1,c||k()};return{scroll:l,reset:()=>{console.log("reset"),d=!0,g=e.scrollTop}}}function systemControl(){var a=smoothScroll(140,16);return{stop:()=>{a.reset()},wheel:b=>{b.preventDefault(),a.scroll(b)}}}function eventObserver(){console.log("eventObserver");var a=systemControl();// window.onwheel = wheel;
window.addEventListener("wheel",a.wheel,{passive:!1}),window.addEventListener("mousewheel",a.wheel,{passive:!1}),window.addEventListener("DOMMouseScroll",a.wheel,{passive:!1});window.addEventListener("keydown",b=>{var c=b.keyCode;(38===c||40===c)&&a.stop()})}document.addEventListener("DOMContentLoaded",function(){console.log("DOMContentLoaded"),eventObserver()});