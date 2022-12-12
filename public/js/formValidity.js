const svgExclamationCircle = '<svg xmlns="http://www.w3.org/2000/svg" class="danger-exclamation-circle" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/></svg>'

var formsToValidate = document.querySelectorAll('.validated-form');
const titleInp = document.getElementById('title');
const locationInp = document.getElementById('location');
const priceInp = document.getElementById('price');
const descriptionInp = document.getElementById('description');
const images = document.getElementById('images');
const errorMsgs = document.getElementById('error-msgs');
const alreadyImgs = document.getElementsByClassName('img-deletetion-container');
const alreadyImgsCheckboxes = document.getElementsByClassName('already-img-checkbox');
const campgroundTitleDiv = document.querySelector('.new.camp-title');

function isInvalidTitle(l) {
    if (l.data && l.data === 'NAME EXIST') {
        const paragraph = document.createElement('p');
        paragraph.innerHTML = `${svgExclamationCircle}Title <b>"${titleInp.value}"</b> already exists`;
        paragraph.classList.add('title-alert');
        campgroundTitleDiv.append(paragraph);
    } else {
        const toBeRemove = document.querySelector('.title-alert');
        toBeRemove ? toBeRemove.remove() : '';
    }
}

function formValidation() {

    Array.from(formsToValidate)
        .forEach(function (form) {
            form.addEventListener('submit', function (e) {
                function notValid(el) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (el) {
                        el.classList.add('bad-value');
                        el.classList.remove('bad-value-edited');
                        let text = document.createElement('p');
                        text.innerHTML = `${svgExclamationCircle} ${el.getAttribute('error-msg')}`;
                        if (!document.getElementsByClassName(`${el.getAttribute('id')}-warning-camp-text`)[0]) {
                            errorMsgs.append(text);
                        }
                        text.classList.add(`${el.getAttribute('id')}-warning-camp-text`)
                    }
                }
                function validInp(el) {
                    if (document.getElementsByClassName(`${el.getAttribute('id')}-warning-camp-text`)[0]) {
                        const toBeRemove = document.getElementsByClassName(`${el.getAttribute('id')}-warning-camp-text`)[0]
                        toBeRemove.remove();
                    }
                    el.classList.remove('bad-value');
                    el.classList.remove('bad-value-edited');
                }
                if (titleInp.value.length < 3 || titleInp.value.length > 40) {
                    notValid(titleInp)
                    titleInp.addEventListener('input', function () {
                        if (titleInp.value.length >= 3 && titleInp.value.length <= 40) {
                            validInp(titleInp)
                        } else {
                            notValid(titleInp)
                        }
                    })
                } else {
                    validInp(titleInp)
                }
                if (locationInp.value.length < 4 || locationInp.value.length > 60) {
                    notValid(locationInp)
                    locationInp.addEventListener('input', function () {
                        if (locationInp.value.length >= 4 && locationInp.value.length <= 60) {
                            validInp(locationInp)
                        } else {
                            notValid(locationInp)
                        }
                    })
                } else {
                    validInp(locationInp)
                }
                if (isNaN(priceInp.value) || priceInp.value.length < 1 || priceInp.value.length > 40) {
                    notValid(priceInp)
                    priceInp.addEventListener('input', function () {
                        if (!isNaN(priceInp.value) && priceInp.value.length >= 1 && priceInp.value.length <= 40) {
                            validInp(priceInp)
                        } else {
                            notValid(priceInp)
                        }
                    })
                } else {
                    validInp(priceInp)
                }
                if (descriptionInp.value.length < 10 || descriptionInp.value.length > 1000) {
                    notValid(descriptionInp)
                    descriptionInp.addEventListener('input', function () {
                        if (descriptionInp.value.length >= 10 && descriptionInp.value.length <= 1000) {
                            validInp(descriptionInp)
                        } else {
                            notValid(descriptionInp)
                        }
                    })
                } else {
                    validInp(descriptionInp)
                }

                let checkedImgs = 0;
                Array.from(alreadyImgsCheckboxes).forEach(m => {
                    m.checked ? checkedImgs++ : '';
                })
                const totalImgsUpload = images.files.length + alreadyImgs.length - checkedImgs // úplný počet uploadovaných imgs

                var file = images.files;
                let fileOverSize = false;
                for (let f of file) {
                    let fileSize = Math.round((f.size / 1024));
                    if (fileSize > 10000000) {
                        fileOverSize = true;
                    }
                }
                if (images.files.length > 7 || totalImgsUpload > 7 || fileOverSize) {
                    if (!form.classList.contains('edit-camp-form')) {
                        notValid(images)
                        images.addEventListener('change', function () {
                            if (images.files.length <= 7) {
                                validInp(images)
                            } else {
                                notValid(images)
                            }
                        })
                    } else if (images.files.length > 7 || totalImgsUpload > 7 || fileOverSize) {
                        notValid(images);
                        images.addEventListener('change', function () {
                            if (images.files.length >= 1 && images.files.length <= 7) {
                                validInp(images)
                            } else {
                                notValid(images)
                            }
                        })
                    } else {
                        validInp(images)
                    }
                } else {
                    validInp(images)
                }
                if (document.querySelector('.title-alert')) {
                    notValid()
                }
                form.classList.add('was-validated')

            }, false)
        })
}

formValidation();


axios.defaults.withCredentials = true

if (!document.querySelector('.edit-camp-form')) {
    titleInp.addEventListener('change', function () {
        axios({
            method: 'post',
            url: '/campgrounds/istitletaken',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                title: titleInp.value
            }
        })
            .then((res) => isInvalidTitle(res))
            .catch();
    });
}