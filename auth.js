document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector(".login-form");
    const signupForm = document.querySelector(".signup-form");

    // User sign up
    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            event.preventDefault(); // prevent page refresh
            
            const email = signupForm.email.value;
            const password = signupForm.psw.value;
            const repeatPassword = signupForm["psw-repeat"].value;

            if (password !== repeatPassword) {
                alert("Passwords do not match!");
                return;
            }

            // Store user information to localStorage 
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userPassword", password);
            
            alert("Signup successfully! Redirecting to login page...");
            window.location.href = "login.html";
        });
    }

    // User login
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            
            const email = loginForm.email.value;
            const password = loginForm.psw.value;

            const storedEmail = localStorage.getItem("userEmail");
            const storedPassword = localStorage.getItem("userPassword");

            if (email === storedEmail && password === storedPassword) {
                alert("Login successfully! Redirecting to homepage...");
                window.location.href = "index.html";
            } else {
                alert("Invalid email or password. Please try again.");
            }
        });
    }
});
