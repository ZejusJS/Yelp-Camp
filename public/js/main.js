const closeBtns = document.getElementsByClassName('close-btn');

Array.from(closeBtns).forEach(function (close) {
    close.addEventListener('click', function () {
        let toBeRemoveEl = close.parentElement
        if (toBeRemoveEl && toBeRemoveEl.classList.contains('to-be-remove')) {
            toBeRemoveEl.style.opacity = 0;
            setTimeout(() => {
                toBeRemoveEl.remove();
            }, 150);
        };
        while (toBeRemoveEl && !toBeRemoveEl.classList.contains('to-be-remove')) {
            toBeRemoveEl = toBeRemoveEl.parentElement
            if (toBeRemoveEl.classList.contains('to-be-remove')) {
                toBeRemoveEl.style.opacity = 0;
                setTimeout(() => {
                    toBeRemoveEl.remove();
                }, 150);
            }
        };
    })
})

try {
    options = {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric',
        hour12: false
    };

    const createdAt = document.querySelectorAll('.created-at .date');
    for (let created of createdAt) {
        const date = new Date(created.innerText)
        created.innerText = new Intl.DateTimeFormat('default', options).format(date)
    }
} catch (e) {

}

try {
    const stype = document.querySelectorAll('.search-stype');
    stype.forEach(el => {
        el.addEventListener('change', function () {
            document.getElementById('search-campgrounds').submit()
        })
    })

    const search = document.getElementById('camp-search');
    const searchParams = document.querySelector('.camp-search-params');
    search.addEventListener('input', function () {
        searchParams.classList.add('params-expanded')
        if (search.value.length < 1) {
            searchParams.classList.remove('params-expanded')
        }
    })
} catch (e) {

}

const formsToStop = document.querySelectorAll('.form-to-stop')
const buttonInForms = document.querySelectorAll('form button')

try {
    formsToStop.forEach(function (form) {
        form.addEventListener('submit', function (e) {
            buttonInForms.forEach(btn => btn.disabled = true)
        })
    })
} catch (e) {
    console.error(e)
}


async function check_form(form) {
    function isSuspended(res) {
        let formSubmitting = false;
        if (res.data === "YEP") {
            formSubmitting = true
            form.submit()
            // console.log('dsgfsdgsdg')
        } else if (!formSubmitting) {
            const alert = document.querySelector('.alert-top-wrapper .alert-top');
            alert.classList.add('alert-top-visible');
            setTimeout(() => {
                alert.classList.remove('alert-top-visible');
            }, 4000);
            setTimeout(() => {
                buttonInForms.forEach(btn => btn.disabled = false)
            }, 1000);
        }
    }
    await axios({
        method: 'post',
        url: '/issuspended'
    })
        .then((res) => isSuspended(res))
        .catch();
}


async function check_comment(form) {
    const selectedForm = document.getElementById(form.getAttribute('id'))
    const textComment = document.querySelector(`#${form.getAttribute('id')} .comment-text`)
    if (textComment.value.length < 1 || textComment.value.length > 2000) {
        textComment.classList.add('bad-value-comment');
        setTimeout(() => {
            buttonInForms.forEach(btn => btn.disabled = false)
        }, 50);
        textComment.addEventListener('input', function () {
            if (textComment.value.length > 0 && textComment.value.length < 1999) {
                textComment.classList.remove('bad-value-comment');
            } else {
                textComment.classList.add('bad-value-comment');
            }
        })
    } else {
        textComment.classList.remove('bad-value-comment');
        function isSuspended(res) {
            let formSubmitting = false;
            if (res.data === "YEP") {
                formSubmitting = true
                form.submit()
                // console.log('dsgfsdgsdg')
            } else if (!formSubmitting) {
                const alert = document.querySelector('.alert-top-wrapper .alert-top');
                const aletrTopText = document.querySelector('.alert-top span')
                aletrTopText.innerHTML = "Please wait before posting another comment"
                    alert.classList.add('alert-top-visible');
                setTimeout(() => {
                    alert.classList.remove('alert-top-visible');
                }, 4000);
                setTimeout(() => {
                    buttonInForms.forEach(btn => btn.disabled = false)
                }, 1000);
            }
        }
        await axios({
            method: 'post',
            url: '/issuspended'
        })
            .then((res) => isSuspended(res))
            .catch();
    }
}