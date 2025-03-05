document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const errorMsg = document.getElementById("error-msg1");

    if (password.length < 8) {
        errorMsg.style.display = "block";
        return;
    }
    else {
        errorMsg.style.display = "none";
    }

    var captchaResponse = grecaptcha.getResponse(); // Ensure this is only checked for signup

    if (captchaResponse.length === 0) {
        alert("Please complete the reCAPTCHA!");
        return;
    }

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

// Login Form Submission
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("signinEmail").value;
    const password = document.getElementById("signinPassword").value;
    const errorMsg = document.getElementById("error-msg2");

    if (password.length < 8) {
        errorMsg.style.display = "block";
        return;
    }
    else {
        errorMsg.style.display = "none";
    }

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            window.location.href = "/home.html"; // Redirect on success
        } else {
            alert(data.message); // Show error message on failure
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Login failed. Please try again.");
    }
});

// Toggle Password Visibility
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
