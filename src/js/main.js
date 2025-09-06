import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, Keyboard, A11y } from 'swiper/modules';

document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.js-swiper', {
    modules: [Navigation, Pagination, Autoplay, Keyboard, A11y],
    loop: false,
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: { delay: 4000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    keyboard: { enabled: true },
    a11y: { enabled: true }
  });
});
