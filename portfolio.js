
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

// Text colors only — no background gradients
const phraseColors = [
    "#8a2be2", // Purple
    "#1e90ff", // Blue
    "#ff8c00", // Orange
    "#dc3545"  // Red
];

// --- Apply Text Color Only ---

function applyPhraseColor() {
    const element = document.getElementById("dynamic-typing-text");
    if (!element) return;

    element.classList.remove("wipe-effect");

    // Remove all background-based text effects
    element.style.background = "none";
    element.style.backgroundImage = "none";
    element.style.backgroundSize = "auto";
    element.style.backgroundPosition = "initial";
    element.style.backgroundClip = "initial";
    element.style.webkitBackgroundClip = "initial";
    element.style.webkitTextFillColor = "initial";

    // Apply a visible solid text color
    element.style.color = phraseColors[phraseIndex];
}

// --- Typing and Deleting Cycle ---

function typeDeleteCycle() {
    const element = document.getElementById("dynamic-typing-text");
    const cursor = document.querySelector(".cursor");

    if (!element || !cursor) {
        console.error(
            "Typing elements not found. Check #dynamic-typing-text and .cursor."
        );
        return;
    }

    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
        if (charIndex === 0) {
            applyPhraseColor();
        }

        // Display the currently typed characters
        element.textContent = currentPhrase.substring(0, charIndex);
        charIndex++;

        if (charIndex > currentPhrase.length) {
            // Pause after the complete phrase is displayed
            typingTimer = setTimeout(() => {
                isDeleting = true;
                charIndex = currentPhrase.length;

                // Do not use wipe-effect or transparent text
                element.classList.remove("wipe-effect");
                element.style.color = phraseColors[phraseIndex];

                typeDeleteCycle();
            }, pauseTime);
        } else {
            typingTimer = setTimeout(typeDeleteCycle, typingSpeed);
        }
    } else {
        // Delete characters while keeping the remaining text visible
        element.textContent = currentPhrase.substring(0, charIndex);
        element.style.color = phraseColors[phraseIndex];
        charIndex--;

        if (charIndex < 0) {
            // Move to the next phrase
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            charIndex = 0;

            element.textContent = "";
            element.classList.remove("wipe-effect");

            // Apply the next phrase's color before typing starts
            applyPhraseColor();

            typingTimer = setTimeout(typeDeleteCycle, pauseTime);
        } else {
            typingTimer = setTimeout(typeDeleteCycle, deletingSpeed);
        }
    }
}

// --- Initialize Typing Animation ---

function initializeTypingAnimation() {
    const element = document.getElementById("dynamic-typing-text");
    const cursor = document.querySelector(".cursor");

    if (!element || !cursor) {
        console.error(
            "Typing elements not found. Check #dynamic-typing-text and .cursor."
        );
        return;
    }

    // Prevent duplicate animation loops
    if (typingTimer !== null) {
        clearTimeout(typingTimer);
        typingTimer = null;
    }

    phraseIndex = 0;
    charIndex = 0;
    isDeleting = false;

    element.textContent = "";
    element.classList.remove("wipe-effect");

    // Remove previous gradient/background styles
    element.style.background = "none";
    element.style.backgroundImage = "none";
    element.style.backgroundSize = "auto";
    element.style.backgroundPosition = "initial";
    element.style.backgroundClip = "initial";
    element.style.webkitBackgroundClip = "initial";
    element.style.webkitTextFillColor = "initial";

    applyPhraseColor();
    typeDeleteCycle();
}

// --- Page Load / Restore ---

window.addEventListener("pageshow", function () {
    initializeTypingAnimation();
});

// --- EmailJS Contact Form ---

document.addEventListener("DOMContentLoaded", function () {
    if (typeof emailjs === "undefined") {
        console.error("EmailJS library was not loaded.");
        return;
    }

    emailjs.init("enNSaJi9G8hCnI6Rt");

    const form = document.getElementById("contact-form");
    const statusMessage = document.getElementById("status-message");
    const spinner = document.getElementById("loadingSpinner");
    const sendBtn = document.getElementById("sendBtn");

    if (!form || !statusMessage || !spinner || !sendBtn) {
        console.error("One or more contact form elements were not found.");
        return;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        spinner.classList.remove("d-none");
        sendBtn.disabled = true;

        emailjs.sendForm("service_rnnotqp", "template_qr6qd9d", this)
            .then(() => {
                statusMessage.innerText = "✅ Message sent successfully!";
                statusMessage.classList.add("text-success");
                statusMessage.classList.remove("text-danger");
                form.reset();
            })
            .catch((error) => {
                statusMessage.innerText =
                    "❌ Failed to send message. Please try again.";
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
