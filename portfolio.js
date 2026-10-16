
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

// Define your gradients for each phrase (Light Mode)
const phraseGradients = [
    'linear-gradient(to right, #007bff, #8a2be2)',
    'linear-gradient(to right, #28a745, #1e90ff)',
    'linear-gradient(to right, #ffc107, #ff4500)',
    'linear-gradient(to right, #dc3545, #ff1493)'
];

// Define your gradients for each phrase (Dark Mode)
const phraseGradientsDarkMode = [
    'linear-gradient(to right, #66b3ff, #c792ea)',
    'linear-gradient(to right, #98fb98, #6495ed)',
    'linear-gradient(to right, #ffd700, #ff8c00)',
    'linear-gradient(to right, #ff6347, #ff69b4)'
];

// Prevent multiple typing animation loops
let typingTimer = null;


// --- Helper Functions ---

function applyPhraseGradient() {
    const dynamicTypingTextElement = document.getElementById('dynamic-typing-text');
    if (!dynamicTypingTextElement) return;

    const isDarkMode = document.body.classList.contains('dark-mode');
    const gradients = isDarkMode ? phraseGradientsDarkMode : phraseGradients;

    dynamicTypingTextElement.style.background = gradients[phraseIndex];
    dynamicTypingTextElement.style.backgroundSize = '200% 100%';
    dynamicTypingTextElement.style.backgroundPosition = '0% 0';
}


// --- Typing Animation ---

function typeDeleteCycle() {
    const dynamicTypingTextElement = document.getElementById('dynamic-typing-text');
    const cursorElement = document.querySelector('.cursor');

    if (!dynamicTypingTextElement || !cursorElement) {
        console.error("Typing animation elements not found. Stopping cycle.");
        typingTimer = null;
        return;
    }

    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
        // Apply gradient and reset text visibility at the start of a phrase
        if (charIndex === 0) {
            applyPhraseGradient();
            dynamicTypingTextElement.classList.remove('wipe-effect');
            dynamicTypingTextElement.style.color = '';
        }

        // Add the next character
        dynamicTypingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;

        // Pause when the complete phrase has been typed
        if (charIndex >= currentPhrase.length) {
            typingTimer = setTimeout(() => {
                isDeleting = true;
                typeDeleteCycle();
            }, pauseTime);
        } else {
            typingTimer = setTimeout(typeDeleteCycle, typingSpeed);
        }

    } else {
        // Remove one character at a time
        dynamicTypingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex <= 0) {
            // Prepare the next phrase
            charIndex = 0;
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;

            dynamicTypingTextElement.textContent = '';
            dynamicTypingTextElement.classList.remove('wipe-effect');
            dynamicTypingTextElement.style.color = '';
            dynamicTypingTextElement.style.background = '';
            dynamicTypingTextElement.style.backgroundSize = '';
            dynamicTypingTextElement.style.backgroundPosition = '';

            // Brief pause before typing the next phrase
            typingTimer = setTimeout(typeDeleteCycle, 300);
        } else {
            typingTimer = setTimeout(typeDeleteCycle, deletingSpeed);
        }
    }
}

function initializeTypingAnimation() {
    const dynamicTypingTextElement = document.getElementById('dynamic-typing-text');
    const cursorElement = document.querySelector('.cursor');

    if (!dynamicTypingTextElement || !cursorElement) {
        console.error("Typing animation elements not found. Cannot start animation.");
        return;
    }

    // Clear any existing timer to prevent duplicate animation loops
    if (typingTimer !== null) {
        clearTimeout(typingTimer);
        typingTimer = null;
    }

    // Reset animation state
    phraseIndex = 0;
    charIndex = 0;
    isDeleting = false;

    // Reset text and animation styles
    dynamicTypingTextElement.textContent = '';
    dynamicTypingTextElement.classList.remove('wipe-effect');
    dynamicTypingTextElement.style.color = '';
    dynamicTypingTextElement.style.background = '';
    dynamicTypingTextElement.style.backgroundSize = '';
    dynamicTypingTextElement.style.backgroundPosition = '';

    // Apply the first phrase's gradient and start typing
    applyPhraseGradient();
    typeDeleteCycle();
}


// --- Main Event Listener for Page Load/Restore ---

window.addEventListener('pageshow', (event) => {
    console.log('pageshow event fired. Persisted:', event.persisted);

    // Initialize theme toggle and typing animation
    initializeThemeToggle();
    initializeTypingAnimation();
});


// --- EmailJS Contact Form ---

document.addEventListener("DOMContentLoaded", function() {
    emailjs.init("enNSaJi9G8hCnI6Rt");

    const form = document.getElementById("contact-form");
    const statusMessage = document.getElementById("status-message");
    const spinner = document.getElementById("loadingSpinner");
    const sendBtn = document.getElementById("sendBtn");

    // Stop if the contact form elements are missing
    if (!form || !statusMessage || !spinner || !sendBtn) {
        console.error("One or more contact form elements were not found.");
        return;
    }

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        // Show spinner and disable button
        spinner.classList.remove("d-none");
        sendBtn.disabled = true;

        // Send the form via EmailJS
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
