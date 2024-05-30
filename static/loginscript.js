document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');

    // Check the data attribute and set the active class if needed
    if (container.getAttribute('data-register-error') === 'true') {
        container.classList.add("active");
    }

    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });
});