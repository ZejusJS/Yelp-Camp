const navBtn = document.querySelector('.nav-main > svg');

navBtn.addEventListener('click', () => {
    document.querySelector('.nav-container').classList.toggle('nav-expanded')
});