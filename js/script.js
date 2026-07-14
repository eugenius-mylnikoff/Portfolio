AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-out-cubic'
});

const bird = document.getElementById('flyingBird');
let birdFlying = false;
let birdTimeout;

function flyBird() {
    if (birdFlying) return;
    birdFlying = true;
    const startY = Math.random() * (window.innerHeight - 200) + 100;
    const endY = Math.random() * (window.innerHeight - 200) + 100;
    bird.style.left = (window.innerWidth + 100) + 'px';
    bird.style.top = startY + 'px';
    bird.style.transition = 'none';
    bird.classList.add('visible');
    requestAnimationFrame(() => {
        bird.style.transition = 'left 20s linear, top 20s ease-in-out';
        bird.style.left = '-100px';
        bird.style.top = endY + 'px';
    });
    setTimeout(() => {
        bird.classList.remove('visible');
        birdFlying = false;
    }, 20000);
}

function scheduleBird() {
    const delay = Math.random() * 120000 + 300000;
    birdTimeout = setTimeout(() => {
        flyBird();
        scheduleBird();
    }, delay);
}

bird.addEventListener('click', () => {
    if (birdFlying) {
        openPlayer();
    }
});

const player = document.getElementById('musicPlayer');
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
let isPlaying = false;

function openPlayer() {
    player.classList.add('active');
}

function closePlayer() {
    player.classList.remove('active');
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        updatePlayButton();
    }
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play().catch(e => console.log('Audio play failed'));
    }
    isPlaying = !isPlaying;
    updatePlayButton();
}

function updatePlayButton() {
    const icon = playBtn.querySelector('i');
    if (isPlaying) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
}

const cube = document.getElementById('rustyCube');
const rustyModal = document.getElementById('rustyLakeModal');
let cubeVisible = false;
let cubeTimeout;

function showCube() {
    if (cubeVisible) return;
    cubeVisible = true;
    const x = Math.random() * (window.innerWidth - 150) + 50;
    const y = Math.random() * (window.innerHeight - 200) + 100;
    cube.style.left = x + 'px';
    cube.style.top = y + 'px';
    cube.classList.add('visible');
    cubeTimeout = setTimeout(() => {
        hideCube();
    }, 8000);
}

function hideCube() {
    cube.classList.remove('visible');
    cubeVisible = false;
    clearTimeout(cubeTimeout);
    scheduleCube();
}

function scheduleCube() {
    const delay = Math.random() * 180000 + 420000;
    setTimeout(() => {
        showCube();
    }, delay);
}

cube.addEventListener('click', () => {
    rustyModal.classList.add('active');
    document.body.style.animation = 'glitch 0.5s ease';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 500);
});

function closeRustyModal() {
    rustyModal.classList.remove('active');
}

rustyModal.addEventListener('click', (e) => {
    if (e.target === rustyModal) {
        closeRustyModal();
    }
});

const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `@keyframes glitch { 0% { transform: translate(0); filter: hue-rotate(0deg) contrast(1); } 20% { transform: translate(-10px, 5px); filter: hue-rotate(90deg) contrast(1.5); } 40% { transform: translate(-5px, -10px); filter: hue-rotate(180deg) contrast(0.8); } 60% { transform: translate(10px, 5px); filter: hue-rotate(270deg) contrast(1.3); } 80% { transform: translate(5px, -5px); filter: hue-rotate(360deg) contrast(1); } 100% { transform: translate(0); filter: hue-rotate(0deg) contrast(1); } }
`;
document.head.appendChild(dynamicStyles);

const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');

function openModal(diplomaId) {
    const imgPath = 'images/diplomas/' + diplomaId + '.jpg';
    modal.style.display = 'block';
    modalImg.src = imgPath;
}

function closeModal() {
    modal.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target === modal) {
        closeModal();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeRustyModal();
        closePlayer();
    }
});

document.querySelectorAll('.zoomable-img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function (e) {
        if (!this.closest('.diploma-item')) {
            modal.style.display = 'block';
            modalImg.src = this.src;
        }
    });
});

const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.innerHTML = '✏️';
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.25;
    cursorY += (mouseY - cursorY) * 0.25;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(updateCursor);
}

updateCursor();

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
});

const cursorStyle = document.createElement('style');
cursorStyle.textContent = `.custom-cursor { position: fixed; pointer-events: none; z-index: 99999; font-size: 1.8em; opacity: 1; transform: translate(-20%, -80%); transform-origin: 50% 100%; transition: opacity 0.2s ease; will-change: left, top; } @media (max-width: 768px), (hover: none) { body { cursor: auto; } .custom-cursor { display: none; } }
`;
document.head.appendChild(cursorStyle);

const snakeSection = document.getElementById('it-path');
const snakePath = document.querySelector('.snake-path');
const snakeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            snakePath.style.animationPlayState = 'running';
        } else {
            snakePath.style.animationPlayState = 'paused';
        }
    });
}, { threshold: 0.1 });

if (snakeSection) {
    snakeObserver.observe(snakeSection);
}

const projectShowcases = document.querySelectorAll('.project-showcase');
projectShowcases.forEach(showcase => {
    showcase.addEventListener('mouseenter', function () {
        this.style.transform = 'rotate(0deg) scale(1.01)';
        this.style.transition = 'all 0.3s ease';
    });
    showcase.addEventListener('mouseleave', function () {
        this.style.transform = '';
    });
});

const contactCards = document.querySelectorAll('.contact-card');
contactCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-8px) scale(1.03)';
    });
    card.addEventListener('mouseleave', function () {
        this.style.transform = '';
    });
});

const friendPhotos = document.querySelectorAll('.friend-photo');
friendPhotos.forEach((photo) => {
    photo.addEventListener('mouseenter', function () {
        this.style.transform = 'rotate(0deg) scale(1.1)';
        this.style.zIndex = '10';
    });
    photo.addEventListener('mouseleave', function () {
        this.style.transform = '';
        this.style.zIndex = '';
    });
});

const moviePosters = document.querySelectorAll('.movie-poster');
moviePosters.forEach(poster => {
    poster.addEventListener('mouseenter', function () {
        this.style.transform = 'rotate(0deg) scale(1.08)';
        this.style.zIndex = '10';
    });
    poster.addEventListener('mouseleave', function () {
        this.style.transform = '';
        this.style.zIndex = '';
    });
});

window.addEventListener('load', () => {
    scheduleBird();
    scheduleCube();
});

const egeCards = document.querySelectorAll('.ege-card');
egeCards.forEach((card, index) => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'rotate(0deg) scale(1.1)';
    });
    card.addEventListener('mouseleave', function () {
        if (index === 0) this.style.transform = 'rotate(-2deg)';
        else if (index === 1) this.style.transform = 'rotate(1deg)';
        else this.style.transform = 'rotate(-1deg)';
    });
});

const techBadges = document.querySelectorAll('.tech-tag');
techBadges.forEach(badge => {
    badge.addEventListener('mouseenter', function () {
        this.style.transform = 'rotate(0deg) scale(1.15)';
    });
    badge.addEventListener('mouseleave', function () {
        this.style.transform = '';
    });
});

document.querySelectorAll('.review-item').forEach(review => {
    review.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-5px)';
        this.style.transition = 'all 0.3s ease';
    });
    review.addEventListener('mouseleave', function () {
        this.style.transform = '';
    });
});

document.querySelectorAll('.diploma-item').forEach(item => {
    item.addEventListener('click', function (e) {
        const img = this.querySelector('img');
        if (img) {
            modal.style.display = 'block';
            modalImg.src = img.src;
        }
    });
});

const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
