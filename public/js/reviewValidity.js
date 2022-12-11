const review = document.querySelector('#review-form');
const reviewBody = document.querySelectorAll('#review-form #review-body')[0];
const reviewRating = document.querySelectorAll('#review-form #rating')[0];

review.addEventListener('submit', function (e) {
    function notValid(el) {
        e.preventDefault();
        e.stopPropagation();
        if (el !== undefined || null) {
            el.classList.add('bad-review');
            el.classList.remove('right-review');
        }
    }

    if (reviewBody.value.length > 1800 || reviewBody.value.length < 15) {
        notValid(reviewBody);
        reviewBody.addEventListener('keyup', function () {
            if (reviewBody.value.length <= 1800 && reviewBody.value.length >= 15) {
                reviewBody.classList.add('right-review')
            } else {
                notValid(reviewBody);
            }
        });
    } else {
        reviewBody.classList.add('right-review')
    }
    if (reviewRating.value < 1 || reviewRating.value > 5) {
        notValid();
    } else {
    }
});

// createdAt.innerText