window.onload = function () {
    console.log("✅ window.onload executed!");

    let captchaElements = document.querySelectorAll(".g-recaptcha");
    console.log("Found reCAPTCHA elements:", captchaElements);

    if (!window.__recaptchaWidgets) window.__recaptchaWidgets = {};

    captchaElements.forEach((captchaElement, index) => {
        let elementId = captchaElement.id; // Get the ID (e.g., "Scaptcha" or "Lcaptcha")

        // ✅ Prevent duplicate rendering
        if (captchaElement.hasAttribute("data-widget-id")) {
            console.log(`⚠ reCAPTCHA already rendered for ${elementId}, skipping.`);
            return;
        }

        console.log(`🆕 Rendering reCAPTCHA for ${elementId}`);

        let widgetId = grecaptcha.render(captchaElement, {
            sitekey: "6Leq59oqAAAAAEl2Wk3srUOD4ascXa2lwMHVLsph"
        });

        captchaElement.setAttribute("data-widget-id", widgetId);
        window.__recaptchaWidgets[elementId] = widgetId;
    });

    console.log("✅ Assigned reCAPTCHA Widget IDs:", window.__recaptchaWidgets);
};



document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    var captchaResponse = grecaptcha.getResponse(0);
    if (captchaResponse.length === 0) {
        alert("Please complete the reCAPTCHA!");
        return;
    }

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
        const response = await fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, captcha: captchaResponse }),
        });

        const data = await response.json();
        alert(data.message);

        if (response.ok) window.location.href = "/home.html"; // Redirect on success
    } catch (error) {
        console.error("Error:", error);
        alert("Signup failed. Please try again.");
    }
});


document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let loginWidgetId = document.getElementById("Lcaptcha").getAttribute("data-widget-id");

    if (!loginWidgetId) {
        alert("⚠ Please refresh the page and try again.");
        console.log("⚠ Login reCAPTCHA widget ID not found!");
        return;
    }

    let response = grecaptcha.getResponse(loginWidgetId);
    console.log("🔍 CAPTCHA Response:", response);

    if (!response) {
        alert("⚠ Please complete the reCAPTCHA!");
        return;
    }

    const email = document.getElementById("signinEmail").value;
    const password = document.getElementById("signinPassword").value;

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, captcha: response }),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (response.ok) {
                window.location.href = "/home.html"; // Redirect on success
            } else {
                grecaptcha.reset(loginWidgetId); // Reset CAPTCHA on failure
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Login failed. Please try again.");
            grecaptcha.reset(loginWidgetId);
        });
});


// for toggle password
function togglePassword(fieldId, icon) {
    const passwordField = document.getElementById(fieldId);
    if (passwordField.type === "password") {
        passwordField.type = "text";
        icon.innerHTML = `<i class="fa-regular fa-eye"></i>`;
    } else {
        passwordField.type = "password";
        icon.innerHTML = `<i class="fa-regular fa-eye-slash"></i>`;
    }
}

function loadRecaptcha() {
    grecaptcha.render("recaptcha-container", {
        "sitekey": "6Leq59oqAAAAAEl2Wk3srUOD4ascXa2lwMHVLsph"
    });
}



