import burger from './modules/burger.js';
import A11yDialog from 'a11y-dialog';
// import smoothscroll from 'smoothscroll-polyfill';
// import scroll from './modules/smoothScroll.js';
import tabbis from './vendor/tabs.js';
// import accordion from './modules/accordion.js';
import getCurrentYear from './modules/getYear.js';
import Swiper, { Navigation, Pagination } from 'swiper';
import 'swiper/css';

/* eslint-disable no-unused-vars */

// Get year
getCurrentYear('copyright-year');

// Burger ======================================================================
burger('.burger', '.nav', '.nav__link', 'body');

// SmoothScroll ================================================================
// smoothscroll.polyfill();
// scroll('.anchor-link');

// Tabs ========================================================================
// https://github.com/jenstornell/tabbis.js
tabbis();

// Accordeon ===================================================================
// accordion('.accordion__head');

// Popup ===================================================================
const dialogUser = document.getElementById('dialog-user');
const dialog = new A11yDialog(dialogUser);

dialogUser.addEventListener('hide', function (event) {
  const closePopupBtn = document.querySelector('[data-a11y-dialog-show]');
  closePopupBtn.blur();
});

// Swiper ======================================================================
const swiper = new Swiper('.production__slider', {
  modules: [Navigation, Pagination],
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    type: 'fraction'
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  slidesPerView: 4,
  spaceBetween: 15
});
/* eslint-enable no-unused-vars */
