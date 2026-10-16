
// --- Global Variables for Typing Animation State ---
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

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
    const dynamicTypingTextElement = document.getElementById('dynamic-typing-text');
    if (!dynamicTypingTextElement) return;

    dynamicTypingTextElement.style.background = phraseGradients[phraseIndex];
    dynamicTypingTextElement.style.backgroundSize = '200% 100%';
    dynamicTypingTextElement.style.backgroundPosition = '0% 0';
}


function typeDeleteCycle() {
    const dynamicTypingTextElement = document.getElementById('dynamic-typing-text');
    const cursorElement = document.querySelector('.cursor');

    if (!dynamicTypingTextElement || !cursorElement) {
        console.error("Typing animation elements not found. Check your HTML IDs and classes.");
        return;
    }

    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
        if (charIndex === 0) {
            applyPhraseGradient();
            dynamicTypingTextElement.style.color = '';
        }

        dynamicTypingTextElement.textContent = currentPhrase.substring(0, charIndex);
        charIndex++;

        if (charIndex > currentPhrase.length) {
            // Finished typing: pause, then begin deleting
            setTimeout(() => {
                isDeleting = true;
                charIndex = currentPhrase.length;

                dynamicTypingTextElement.classList.add('wipe-effect');
                dynamicTypingTextElement.style.color = 'transparent';

                typeDeleteCycle();
            }, pauseTime);
        } else {
            setTimeout(typeDeleteCycle, typingSpeed);
        }
    } else {
        // Deleting phase
        dynamicTypingTextElement.textContent = currentPhrase.substring(0, charIndex);
        charIndex--;

        if (charIndex < 0) {
            // Move to the next phrase
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            charIndex = 0;

            dynamicTypingTextElement.classList.remove('wipe-effect');
            dynamicTypingTextElement.style.color = '';
            dynamicTypingTextElement.style.background = '';
            dynamicTypingTextElement.style.backgroundSize = '';
            dynamicTypingTextElement.style.backgroundPosition = '';

            void dynamicTypingTextElement.offsetWidth;

            setTimeout(() => {
                typeDeleteCycle();
            }, pauseTime);
        } else {
            setTimeout(typeDeleteCycle, deletingSpeed);
        }
    }
}


// --- Typing Animation Initialization ---

function initializeTypingAnimation() {
    const dynamicTypingTextElement = document.getElementById('dynamic-typing-text');
    const cursorElement = document.querySelector('.cursor');

    if (dynamicTypingTextElement && cursorElement) {
        phraseIndex = 0;
        charIndex = 0;
        isDeleting = false;

        dynamicTypingTextElement.textContent = '';
        dynamicTypingTextElement.classList.remove('wipe-effect');
        dynamicTypingTextElement.style.color = '';
        dynamicTypingTextElement.style.background = '';
        dynamicTypingTextElement.style.backgroundSize = '';
        dynamicTypingTextElement.style.backgroundPosition = '';

        void dynamicTypingTextElement.offsetWidth;

        applyPhraseGradient();
        typeDeleteCycle();
    } else {
        console.error(
            "Typing animation elements not found. Check for #dynamic-typing-text and .cursor in your HTML."
        );
    }
}


// --- Page Load / Restore Event Listener ---

window.addEventListener('pageshow', (event) => {
    console.log('pageshow event fired. Persisted:', event.persisted);

    initializeTypingAnimation();
});


// --- EmailJS Contact Form ---

document.addEventListener("DOMContentLoaded", function() {
    emailjs.init("enNSaJi9G8hCnI6Rt");

    const form = document.getElementById("contact-form");
    const statusMessage = document.getElementById("status-message");
    const spinner = document.getElementById("loadingSpinner");
    const sendBtn = document.getElementById("sendBtn");

    if (!form || !statusMessage || !spinner || !sendBtn) {
        console.error("One or more contact form elements were not found.");
        return;
    }

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        spinner.classList.remove("d-none");
        sendBtn.disabled = true;

        emailjs.sendForm("service_rnnotqp", "template_qr6qd9d", this)
            .then(() => {
                statusMessage.innerText = "✅ Message sent successfully!";
                statusMessage.classList.add("text-success");
                statusMessage.classList.remove("text-danger");
                form.reset();
            }, (error) => {
                statusMessage.innerText = "❌ Failed to send message. Please try again.";
                statusMessage.classList.add("text-danger");
                statusMessage.classList.remove("text-success");
                console.error("EmailJS error:", error);
            })
            .finally(() => {
                spinner.classList.add("d-none");
                sendBtn.disabled = false;
            });
    });
});
