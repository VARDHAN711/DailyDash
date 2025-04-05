document.addEventListener("DOMContentLoaded", function () {
    // === Signup Form ===
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("signupEmail").value;
            const password = document.getElementById("signupPassword").value;
            const errorMsg = document.getElementById("error-msg1");

            if (password.length < 8) {
                errorMsg.style.display = "block";
                return;
            } else {
                errorMsg.style.display = "none";
            }

            const captchaResponse = grecaptcha.getResponse();
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
                if (response.ok) {
                    localStorage.setItem("token", data.token);
                    alert(data.message);
                    window.location.href = "/home.html";
                } else {
                    alert(data.message || "Signup failed. Please try again.");
                }

            } catch (error) {
                console.error("Error:", error);
                alert("Signup failed. Please try again.");
            }
        });
    }

    // === Login Form ===
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("signinEmail").value;
            const password = document.getElementById("signinPassword").value;
            const errorMsg = document.getElementById("error-msg2");

            if (password.length < 8) {
                errorMsg.style.display = "block";
                return;
            } else {
                errorMsg.style.display = "none";
            }

            try {
                const response = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem("token", data.token);
                    window.location.href = "/home.html";
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Login failed. Please try again.");
            }
        });
    }

    // === Profile Page Logic ===
    const token = localStorage.getItem("token");
    if (token && document.getElementById("display-email")) {
        (async () => {
            try {
                const res = await fetch("/api/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const user = await res.json();

                document.getElementById("display-email").textContent = user.email;
                document.getElementById("display-username").textContent = user.username || "-";
                document.getElementById("display-phone").textContent = user.phone || "-";

                document.getElementById("email").value = user.email;
                document.getElementById("username").value = user.username || "";
                document.getElementById("phone").value = user.phone || "";
            } catch (err) {
                console.error("Error loading profile:", err);
            }
        })();
    }

    const editBtn = document.getElementById("editBtn");
    if (editBtn) {
        editBtn.addEventListener("click", () => {
            const profileBoxes = document.querySelectorAll(".profile-container");
            if (profileBoxes.length === 2) {
                profileBoxes[0].style.display = "none";
                profileBoxes[1].style.display = "block";
            }
        });
    }

    const editProfileForm = document.getElementById("editProfileForm");
    if (editProfileForm) {
        editProfileForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const updatedDetails = {
                email: document.getElementById("email").value,
                username: document.getElementById("username").value,
                phone: document.getElementById("phone").value,
                password: document.getElementById("password").value,
            };

            try {
                const res = await fetch("/api/profile", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedDetails),
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("Server response:", errorText);
                    alert("Failed to update profile.");
                    return;
                }

                const data = await res.json();
                alert(data.message);
                window.location.href = "/profile.html"; // ✅ redirect to profile page

            } catch (err) {
                console.error("Profile update error:", err);
                alert("Failed to update profile.");
            }
        });
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "/";
        });
    }

    // Optional: Toggle Password Visibility setup
    window.togglePassword = function (fieldId, icon) {
        const passwordField = document.getElementById(fieldId);
        if (passwordField.type === "password") {
            passwordField.type = "text";
            icon.innerHTML = `<i class="fa-regular fa-eye"></i>`;
        } else {
            passwordField.type = "password";
            icon.innerHTML = `<i class="fa-regular fa-eye-slash"></i>`;
        }
    };
});
