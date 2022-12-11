const svgExclamationCircle = '<svg xmlns="http://www.w3.org/2000/svg" class="danger-exclamation-circle" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/></svg>'

const loginForm = document.getElementById('login-form');
const password = document.getElementById('password');
const email = document.getElementById('email');

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

loginForm.addEventListener('submit', async function (e) {
    function notValid(el) {
        e.preventDefault();
        e.stopPropagation();
        el.classList.add('bad-value');
        el.classList.remove('bad-value-edited');
        document.getElementById(`${el.getAttribute('id')}-err`).innerHTML = `${svgExclamationCircle} ${el.getAttribute('err-msg')}`
    }

    function validInp(el) {
        el.classList.remove('bad-value');
        el.classList.add('bad-value-edited');
        if (document.getElementById(`${el.getAttribute('id')}-err`)) {
            document.getElementById(`${el.getAttribute('id')}-err`).innerHTML = ""
        }
    }

    if (password.value.length < 5 || password.value.length > 40) {
        notValid(password)
        password.addEventListener('input', function () {
            if (password.value.length >= 5 && password.value.length <= 40) {
                validInp(password)
            } else {
                notValid(password)
            }
        })
    }
    if (email.value.length < 3 || email.value.length > 70 || /[&\/\\#,+()$~%'":*?<>{}]/g.test(email.value)) {
        notValid(email)
        email.addEventListener('input', function () {
            if (email.value.length >= 3 && email.value.length <= 70 && !/[&\/\\#,+()$~%'":*?<>{}]/g.test(email.value)) {
                validInp(email)
            } else {
                notValid(email)
            }
        })
    }
    if (!validateEmail(email.value)) {
        notValid(email)
        email.addEventListener('input', function () {
            if (validateEmail(email.value)) {
                validInp(email)
            } else {
                notValid(email)
            }
        })
    }
}, false)