import Swiper from 'swiper';
import Inputmask from 'inputmask';

document.addEventListener('DOMContentLoaded', () => {
    new Swiper('.common-slider', {
        loop: false,
        spaceBetween: 24,
        slidesPerView: "auto"
    });

    // Phone input mask for registration form
    const phoneInput = document.querySelector('input[type="tel"]');
    if (phoneInput) {
        const phoneMask = new Inputmask('(999) 999-99-99');
        phoneMask.mask(phoneInput);
    }

    // Registration form validation
    const registerBtn = document.querySelector('.btn[href="paywall.html"]');
    const agreeCheckbox = document.querySelector('#agree');
    
    if (registerBtn && phoneInput && agreeCheckbox) {
        // Initially disable the registration button
        registerBtn.style.pointerEvents = 'none';
        registerBtn.style.opacity = '0.5';
        
        function validateForm() {
            const phoneValue = phoneInput.value.replace(/\D/g, ''); // Remove non-digits
            const isPhoneValid = phoneValue.length === 10; // 10 digits for Russian phone
            const isAgreed = agreeCheckbox.checked;
            
            if (isPhoneValid && isAgreed) {
                registerBtn.style.pointerEvents = 'auto';
                registerBtn.style.opacity = '1';
            } else {
                registerBtn.style.pointerEvents = 'none';
                registerBtn.style.opacity = '0.5';
            }
        }
        
        // Add event listeners
        phoneInput.addEventListener('input', validateForm);
        agreeCheckbox.addEventListener('change', validateForm);
        
        // Add Enter key listener for phone input
        phoneInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const phoneValue = phoneInput.value.replace(/\D/g, ''); // Remove non-digits
                const isPhoneValid = phoneValue.length === 10;
                const isAgreed = agreeCheckbox.checked;
                
                if (isPhoneValid && isAgreed) {
                    registerBtn.click();
                }
            }
        });
        
        // Add registration goal tracking
        registerBtn.addEventListener('click', function() {
            if (typeof ym !== 'undefined') {
                ym(104039961, 'reachGoal', 'registration');
            }
        });
        
        // Initial validation
        validateForm();
    }

    // Paywall modal functionality
    const payButton = document.querySelector('.btn.pay');
    const overlay = document.querySelector('.overlay');
    const closeButton = document.querySelector('.overlay .close');

    if (payButton && overlay) {
        payButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Track payment button click goal
            if (typeof ym !== 'undefined') {
                ym(104039961, 'reachGoal', 'button_pay');
            }
            overlay.classList.remove('hidden');
        });
    }

    if (closeButton && overlay) {
        closeButton.addEventListener('click', function(e) {
            e.preventDefault();
            overlay.classList.add('hidden');
        });
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
