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

try {
    const forms = document.querySelectorAll('form')
    const buttonInForms = document.querySelectorAll('form button')

    forms.forEach(function (form){
        form.addEventListener('submit', function(e) {
            buttonInForms.forEach(btn => btn.disabled = true)
        })
    })
} catch (e) {
    console.error(e)
}