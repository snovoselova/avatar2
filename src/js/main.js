import Swiper from 'swiper';
import Inputmask from 'inputmask';

document.addEventListener('DOMContentLoaded', () => {
    new Swiper('.common-slider', {
        loop: false,
        spaceBetween: 24,
    });

    // Phone input mask for registration form
    const phoneInput = document.querySelector('input[type="tel"]');
    if (phoneInput) {
        const phoneMask = new Inputmask('(999) 999-99-99');
        phoneMask.mask(phoneInput);
    }

    // Toggle для футера
    const footerToggle = document.querySelector('.footer-toggle');
    const footerLink = document.querySelector('.footer-top .logo');
    const footerContent = document.querySelector('.footer-content');

    if (footerToggle && footerContent) {
        footerToggle.addEventListener('click', footerToggleHandler);
        footerLink.addEventListener('click', footerToggleHandler);
    }

    function footerToggleHandler(e) {
        const isExpanded = footerToggle.getAttribute('aria-expanded') === 'true';

        // Переключаем состояние
        footerToggle.setAttribute('aria-expanded', !isExpanded);
        footerContent.classList.toggle('hidden');

        e.preventDefault();
    }
});
