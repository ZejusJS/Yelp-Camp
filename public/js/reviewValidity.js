const review = document.querySelector('#review-form');
const reviewBody = document.querySelectorAll('#review-form #review-body')[0];
const reviewRating = document.querySelectorAll('#review-form #rating')[0];

async function check_review(form) {
    function notValid(el) {
        if (el !== undefined || null) {
            el.classList.add('bad-review');
            el.classList.remove('right-review');
            setTimeout(() => {
                buttonInForms.forEach(btn => btn.disabled = false)
            }, 50);
        }
    }
    async function valid(el) {
        function isSuspended(res) {
            let formSubmitting = false;
            if (res.data === "YEP") {
                formSubmitting = true
                form.submit()
                // console.log('dsgfsdgsdg')
            } else if (!formSubmitting) {
                const alert = document.querySelector('.alert-top-wrapper .alert-top');
                alert.classList.add('alert-top-visible');
                const aletrTopText = document.querySelector('.alert-top span')
                aletrTopText.innerHTML = "Please wait before posting a review"
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

    if (reviewBody.value.length > 1800 || reviewBody.value.length < 15) {
        notValid(reviewBody);
        reviewBody.addEventListener('input', function () {
            if (reviewBody.value.length <= 1800 && reviewBody.value.length >= 15) {
                reviewBody.classList.add('right-review')
            } else {
                notValid(reviewBody);
            }
        });
    } else {
        reviewBody.classList.add('right-review')
        valid()
    }

}

// review.addEventListener('submit', function (e) {
//     function notValid(el) {
//         e.preventDefault();
//         e.stopPropagation();
//         if (el !== undefined || null) {
//             el.classList.add('bad-review');
//             el.classList.remove('right-review');
//         }
//     }

//     if (reviewBody.value.length > 1800 || reviewBody.value.length < 15) {
//         notValid(reviewBody);
//         reviewBody.addEventListener('input', function () {
//             if (reviewBody.value.length <= 1800 && reviewBody.value.length >= 15) {
//                 reviewBody.classList.add('right-review')
//             } else {
//                 notValid(reviewBody);
//             }
//         });
//     } else {
//         reviewBody.classList.add('right-review')
//     }
// }, false);

// createdAt.innerText