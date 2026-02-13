// Canvas Background Particles
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 120;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        const colors = ['#FF6B9D', '#FF8FA3', '#FFB3C6', '#FFC2D1', '#FFE5EC', '#E8B4B8', '#FFB6C1'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.fillStyle = 'rgba(255, 107, 157, 0.03)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Floating Hearts
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    const hearts = ['❤️', '💕', '💖', '💗', '💝', '💘', '💓', '💞'];
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 6 + 8) + 's';
    heart.style.animationDelay = Math.random() * 5 + 's';
    document.getElementById('floatingHearts').appendChild(heart);
    setTimeout(() => heart.remove(), 15000);
}

setInterval(createFloatingHeart, 400);

// Loader - Create Sparkles
function createLoaderSparkles() {
    const sparklesContainer = document.getElementById('loaderSparkles');
    const sparkleCount = 20;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 3 + 's';
        sparkle.style.animationDuration = (Math.random() * 2 + 2) + 's';
        sparklesContainer.appendChild(sparkle);
    }
}

// Loader
createLoaderSparkles();

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 2500);
});

// Music Player
const musicPlayer = document.getElementById('musicPlayer');
const bgMusic = document.getElementById('bgMusic');
const playBtn = document.getElementById('playBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
let isPlaying = false;
let isMinimized = false;

// Page Navigation System
let currentPage = 'hero';
const pages = ['hero', 'messages', 'memories', 'gallery', 'final'];

function goToPage(pageId) {
    if (pageId === currentPage) return;

    const currentPageEl = document.getElementById(`page-${currentPage}`);
    const nextPageEl = document.getElementById(`page-${pageId}`);
    
    if (!currentPageEl || !nextPageEl) return;

    // Get page indices for direction
    const currentIndex = pages.indexOf(currentPage);
    const nextIndex = pages.indexOf(pageId);
    const isNext = nextIndex > currentIndex;

    // Hide current page with exit animation
    currentPageEl.classList.remove('active');
    currentPageEl.classList.add(isNext ? 'slide-out' : 'fade-out');
    
    // Show next page with enter animation
    setTimeout(() => {
        currentPageEl.classList.remove('slide-out', 'fade-out');
        currentPageEl.style.display = 'none';
        
        nextPageEl.style.display = 'block';
        nextPageEl.classList.add('active', isNext ? 'slide-in' : 'fade-in');
        
        // Scroll to top
        nextPageEl.scrollTop = 0;
        
        // Update navigation buttons
        updateNavButtons(pageId);
        
        // Remove animation classes after animation completes
        setTimeout(() => {
            nextPageEl.classList.remove('slide-in', 'fade-in');
        }, 800);
        
        currentPage = pageId;
    }, 400);

    // Start music on first navigation
    if (!isPlaying && pageId !== 'hero') {
        bgMusic.play().then(() => {
            isPlaying = true;
            playBtn.textContent = '⏸';
        }).catch(e => {
            console.log("Autoplay blocked");
        });
    }
}

function updateNavButtons(pageId) {
    const allNavButtons = document.querySelectorAll('.nav-button');
    allNavButtons.forEach(btn => btn.classList.add('hidden'));

    const currentIndex = pages.indexOf(pageId);
    
    // Show previous button if not first page
    if (currentIndex > 0) {
        const prevBtn = document.querySelector(`#page-${pageId} .nav-button.prev`);
        if (prevBtn) prevBtn.classList.remove('hidden');
    }
    
    // Show next button if not last page
    if (currentIndex < pages.length - 1) {
        const nextBtn = document.querySelector(`#page-${pageId} .nav-button.next`);
        if (nextBtn) nextBtn.classList.remove('hidden');
    }
}

// Initialize navigation buttons and pages
document.addEventListener('DOMContentLoaded', () => {
    // Hide all pages except hero
    pages.forEach(page => {
        const pageEl = document.getElementById(`page-${page}`);
        if (pageEl) {
            if (page === 'hero') {
                pageEl.style.display = 'block';
                pageEl.classList.add('active');
            } else {
                pageEl.style.display = 'none';
            }
        }
    });
    updateNavButtons('hero');
});

function togglePlay() {
    if (isPlaying) {
        bgMusic.pause();
        playBtn.textContent = '▶';
        isPlaying = false;
    } else {
        bgMusic.play();
        playBtn.textContent = '⏸';
        isPlaying = true;
    }
}

function togglePlayer() {
    isMinimized = !isMinimized;
    musicPlayer.classList.toggle('minimized', isMinimized);
    adjustNavButtonPosition();
}

function adjustNavButtonPosition() {
    const nextButtons = document.querySelectorAll('.nav-button.next:not(.hidden)');
    const musicPlayerEl = document.getElementById('musicPlayer');
    
    nextButtons.forEach(btn => {
        if (window.innerWidth > 1200) {
            if (musicPlayerEl && !musicPlayerEl.classList.contains('minimized')) {
                btn.style.right = '380px';
            } else {
                btn.style.right = '40px';
            }
        } else {
            btn.style.right = '40px';
            btn.style.bottom = '140px';
        }
    });
}

// Adjust button position on resize and page change
window.addEventListener('resize', adjustNavButtonPosition);

// Adjust when navigation buttons are updated
const originalUpdateNavButtons = updateNavButtons;
updateNavButtons = function(pageId) {
    originalUpdateNavButtons(pageId);
    setTimeout(adjustNavButtonPosition, 100);
};

// Initial adjustment
setTimeout(adjustNavButtonPosition, 500);

volumeSlider.addEventListener('input', function() {
    bgMusic.volume = this.value / 100;
    document.getElementById('volumeValue').textContent = this.value + '%';
});

bgMusic.addEventListener('timeupdate', function() {
    if (bgMusic.duration) {
        const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
        progressFill.style.width = progress + '%';
        currentTimeEl.textContent = formatTime(bgMusic.currentTime);
    }
});

bgMusic.addEventListener('loadedmetadata', function() {
    durationEl.textContent = formatTime(bgMusic.duration);
});

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function previousTrack() {
    bgMusic.currentTime = 0;
}

function nextTrack() {
    bgMusic.currentTime = 0;
}

// Progress bar click to seek
document.querySelector('.progress-bar').addEventListener('click', function(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = bgMusic.duration;
    bgMusic.currentTime = (clickX / width) * duration;
});

// Messages (modal content for "A Few Words" cards)
const messages = {
    1: {
        title: 'Tentang Waktu 🕰️',
        text: 'Gue tau lo sibuk banget (namanya juga orang penting wkwk). Jadi, thank you banget udah mau meluangkan waktu di sela-sela kesibukan itu buat gue. It means a lot!'
    },
    2: {
        title: 'The Vibes ✨',
        text: 'Jujur, gue nyaman ngobrol sama lo. Lo bisa diajak serius, tapi bisa diajak receh juga. Kombinasi yang jarang gue temuin. Seru parah!'
    },
    3: {
        title: 'Stay Awesome 🌟',
        text: 'Semangat terus buat semua target dan ambisi lo. Gue di sini support aja, sambil siap jadi tempat lo sambat kalau capek. Hahaha.'
    }
};

function showModal(num) {
    document.getElementById('modalTitle').textContent = messages[num].title;
    document.getElementById('modalText').textContent = messages[num].text;
    document.getElementById('modalSignature').style.display = 'none';
    document.getElementById('modal').style.display = 'flex';
}

function showFinalModal() {
    document.getElementById('modalTitle').textContent = 'Thank You! 💝';
    document.getElementById('modalText').textContent = 'Terima kasih udah baca sampai sini. You are a cool person, and I hope you know that. Happy Valentine\'s Day! 🌹✨';
    document.getElementById('modalSignature').style.display = 'block';
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function openModal(imageSrc) {
    document.getElementById('modalImage').src = imageSrc;
    document.getElementById('photoModal').style.display = 'flex';
}

function closePhotoModal() {
    document.getElementById('photoModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    const photoModal = document.getElementById('photoModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
    if (event.target == photoModal) {
        photoModal.style.display = 'none';
    }
};

// Timeline Animation on Scroll
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
});

// Countdown
function updateCountdown() {
    const targetDate = new Date('2026-02-14T00:00:00').getTime();
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    }
}

updateCountdown();
setInterval(updateCountdown, 60000);


