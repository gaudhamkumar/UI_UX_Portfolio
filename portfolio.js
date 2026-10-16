
 // --- Global Variables for Typing Animation State ---
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimer = null;

const typingSpeed = 70;
const deletingSpeed = 40;
const pauseTime = 1500;

const phrases = [
    "UI/UX Designer",
    "Designing Intuitive User Experiences",
    "User Research • Wireframing • Prototyping",
    "Creating User-Centered Digital Products By Solving Problems."
];

// Gradients for each phrase (Light Mode)
const phraseGradients = [
    'linear-gradient(to right, #007bff, #8a2be2)',
    'linear-gradient(to right, #28a745, #1e90ff)',
    'linear-gradient(to right, #ffc107, #ff4500)',
    'linear-gradient(to right, #dc3545, #ff1493)'
];

// --- Helper Functions ---

function applyPhraseGradient() {
    const element = document.getElementById('dynamic-typing-text');
    if (!element) return;

    element.style.backgroundImage = phraseGradients[phraseIndex];
    element.style.backgroundSize = '200% 100%';
    element.style.backgroundPosition = '0% 0';
    element.style.backgroundClip = 'text';
    element.style.webkitBackgroundClip = 'text';
    element.style.color = 'transparent';
    element.style.webkitTextFillColor = 'transparent';
}

function resetPhraseGradient() {
    const element = document.getElementById('dynamic-typing-text');
    if (!element) return;

    element.classList.remove('wipe-effect');
    element.style.color = 'transparent';
    element.style.webkitTextFillColor = 'transparent';
    element.style.backgroundImage = '';
    element.style.background = '';
    element.style.backgroundSize = '';
    element.style.backgroundPosition = '';
    element.style.backgroundClip = '';
    element.style.webkitBackgroundClip = '';
}

// --- Typing Animation ---

function typeDeleteCycle() {
    const element = document.getElementById('dynamic-typing-text');
    const cursor = document.querySelector('.cursor');

    if (!element || !cursor) {
        console.error(
            "Typing animation elements not found. Check #dynamic-typing-text and .cursor."
        );
        return;
    }

    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
        if (charIndex === 0) {
            element.classList.remove('wipe-effect');
            applyPhraseGradient();
        }

        element.textContent = currentPhrase.substring(0, charIndex);
        charIndex++;

        if (charIndex > currentPhrase.length) {
            typingTimer = setTimeout(() => {
                isDeleting = true;
                charIndex = currentPhrase.length;

                // Keep the gradient text visible while deleting.
                element.classList.remove('wipe-effect');
                typeDeleteCycle();
            }, pauseTime);
        } else {
            typingTimer = setTimeout(typeDeleteCycle, typingSpeed);
        }
    } else {
        element.textContent = currentPhrase.substring(0, charIndex);
        charIndex--;

        if (charIndex < 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            charIndex = 0;

            resetPhraseGradient();

            // Force the browser to refresh the text styles.
            void element.offsetWidth;

            typingTimer = setTimeout(typeDeleteCycle, pauseTime);
        } else {
            typingTimer = setTimeout(typeDeleteCycle, deletingSpeed);
        }
    }
}

// --- Typing Animation Initialization ---

function initializeTypingAnimation() {
    const element = document.getElementById('dynamic-typing-text');
    const cursor = document.querySelector('.cursor');

    if (!element || !cursor) {
        console.error(
            "Typing animation elements not found. Check for #dynamic-typing-text and .cursor in your HTML."
        );
        return;
    }

    // Prevent multiple animation loops if pageshow fires again.
    if (typingTimer !== null) {
        clearTimeout(typingTimer);
        typingTimer = null;
    }

    phraseIndex = 0;
    charIndex = 0;
    isDeleting = false;

    element.textContent = '';
    element.classList.remove('wipe-effect');

    element.style.backgroundImage = '';
    element.style.background = '';
    element.style.backgroundSize = '';
    element.style.backgroundPosition = '';
    element.style.backgroundClip = '';
    element.style.webkitBackgroundClip = '';
    element.style.color = '';
    element.style.webkitTextFillColor = '';

    void element.offsetWidth;

    applyPhraseGradient();
    typeDeleteCycle();
}

// --- Page Load / Restore Event Listener ---

window.addEventListener('pageshow', () => {
    initializeTypingAnimation();
});

// --- EmailJS Contact Form ---

document.addEventListener('DOMContentLoaded', function () {
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS library was not loaded.');
        return;
    }

    emailjs.init('enNSaJi9G8hCnI6Rt');

    const form = document.getElementById('contact-form');
    const statusMessage = document.getElementById('status-message');
    const spinner = document.getElementById('loadingSpinner');
    const sendBtn = document.getElementById('sendBtn');

    if (!form || !statusMessage || !spinner || !sendBtn) {
        console.error('One or more contact form elements were not found.');
        return;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        spinner.classList.remove('d-none');
        sendBtn.disabled = true;

        emailjs.sendForm('service_rnnotqp', 'template_qr6qd9d', this)
            .then(() => {
                statusMessage.innerText = '✅ Message sent successfully!';
                statusMessage.classList.add('text-success');
                statusMessage.classList.remove('text-danger');
                form.reset();
            })
            .catch((error) => {
                statusMessage.innerText =
                    '❌ Failed to send message. Please try again.';
                statusMessage.classList.add('text-danger');
                statusMessage.classList.remove('text-success');
                console.error('EmailJS error:', error);
            })
            .finally(() => {
                spinner.classList.add('d-none');
                sendBtn.disabled = false;
            });
    });
});
