const reviewBtn = document.getElementById('add-review-btn');
const expandable = document.querySelector('.expandable-add-review');

reviewBtn.addEventListener('click', function () {
    if (window.innerWidth < 1100 && !expandable.classList.contains('expanded-add-review')) {
        setTimeout(() => {
            window.location.href = '#add-own-review';
        }, 75);
    }
    expandable.classList.toggle('expanded-add-review');
});

if (document.querySelector('span.not-logged')) {
    const reviewBtnSbmt = document.getElementById('review-submit');
    const reviewBody = document.getElementById('review-body');
    const reviewRating = document.getElementById('rating');
    const starabilityBasic = document.getElementById('starability-basic');
    const noRate = document.getElementById('no-rate');
    reviewBtnSbmt ? reviewBtnSbmt.disabled = true : false ;
    reviewBody ? reviewBody.disabled = true : false ;
    reviewRating ? reviewRating.disabled = true : false;
    starabilityBasic ? starabilityBasic.disabled = true : false;
    noRate ? noRate.checked = true : false;
    reviewBtnSbmt ? reviewBtnSbmt.classList.add('not-logged') : false;
    reviewBody ? reviewBody.classList.add('not-logged') : false;
    starabilityBasic ? starabilityBasic.classList.add('not-logged') : false;
}
