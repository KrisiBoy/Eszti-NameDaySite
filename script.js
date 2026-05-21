const container = document.getElementById('heart-container');
const confettiContainer = document.getElementById('confetti-container');
const peeker = document.getElementById('giraffe-peeker');
const family = document.getElementById('giraffe-family');
const bubble = document.getElementById('speech-bubble');

const heartEmojis = ['💖', '💞', '💘', '❤️', '💓'];
const loveMessages = [
    "Boldog névnapot a legszebb lánynak! 🌸",
    "Mindent köszönök neked, Eszti! ✨",
    "Te vagy a napfény a mindennapjaimban! ☀️",
    "Nagyon-nagyon szeretlek! ❤️",
    "Csodás, vidám napod legyen ma! 🎉",
    "Te vagy a legfantasztikusabb lány a világon! 🥰",
    "Örülök, hogy vagy nekem! 💫"
];

let currentPhotoIndex = 0;
let carouselInterval;

// --- DYNAMIC CAROUSEL: CSAK MOBILON FUT ---
function manageCarouselState() {
    const polaroids = document.querySelectorAll('.polaroid');
    
    if (window.innerWidth > 600) {
        // DESKTOP: Minden időzítőt törlünk, statikusan láthatóvá teszünk minden képet
        if (carouselInterval) clearInterval(carouselInterval);
        polaroids.forEach(p => {
            p.style.opacity = "";
            p.style.transform = "";
            p.classList.remove('active');
        });
    } else {
        // MOBIL: Elindítjuk a Tinder-szerű lapozást
        if (carouselInterval) clearInterval(carouselInterval);
        
        // Alaphelyzet beállítás mobilon
        polaroids.forEach((p, idx) => {
            if(idx === currentPhotoIndex) {
                p.classList.add('active');
                p.style.opacity = "1";
            } else {
                p.classList.remove('active');
                p.style.opacity = "0";
            }
        });

        carouselInterval = setInterval(() => {
            const freshPolaroids = document.querySelectorAll('.polaroid');
            if (freshPolaroids.length === 0) return;

            const currentPhoto = freshPolaroids[currentPhotoIndex];
            currentPhotoIndex = (currentPhotoIndex + 1) % freshPolaroids.length;
            const nextPhoto = freshPolaroids[currentPhotoIndex];

            const swipeRight = Math.random() > 0.5;
            const targetX = swipeRight ? 320 : -320; 
            const targetRotation = swipeRight ? 30 : -30; 

            gsap.timeline()
                .to(currentPhoto, { 
                    x: targetX, 
                    rotation: targetRotation, 
                    opacity: 0, 
                    duration: 0.6, 
                    ease: "power2.inOut",
                    onComplete: () => {
                        currentPhoto.classList.remove('active');
                        gsap.set(currentPhoto, { x: 0, rotation: 0 });
                    }
                });
            
            nextPhoto.classList.add('active');
            gsap.fromTo(nextPhoto, 
                { opacity: 0, scale: 0.85, x: 0 }, 
                { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.2)" }
            );
        }, 3800);
    }
}

function getHeartCountBasedOnScreen() {
    const width = window.innerWidth;
    if (width <= 600) return 3;  
    if (width <= 1024) return 5; 
    return 8;                    
}

function isTooClose(newCoords, existingPositions, minDist) {
    for (let pos of existingPositions) {
        const dx = newCoords.x - pos.x;
        const dy = newCoords.y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDist) return true;
    }
    return false;
}

function generateSpacedPositions(count) {
    const positions = [];
    const isMobile = window.innerWidth <= 600;
    const minDist = isMobile ? 25 : 20; 

    let attempts = 0;
    while (positions.length < count && attempts < 100) {
        attempts++;
        const isLeft = Math.random() > 0.5;
        let x;
        
        if (isMobile) {
            x = isLeft ? (Math.random() * 10 + 4) : (Math.random() * 10 + 86);
        } else {
            x = isLeft ? (Math.random() * 15 + 5) : (Math.random() * 15 + 80);
        }
        
        const y = Math.random() * 75 + 10; 
        const newCoord = { x, y };

        if (!isTooClose(newCoord, positions, minDist)) {
            positions.push(newCoord);
        }
    }
    return positions;
}

function spawnDynamicEnvironment() {
    container.innerHTML = ""; 
    const count = getHeartCountBasedOnScreen();
    const coordinates = generateSpacedPositions(count);
    const isMobile = window.innerWidth <= 600;
    
    coordinates.forEach((coords, index) => {
        const heart = document.createElement('div');
        heart.className = 'static-heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        
        const baseSize = isMobile ? 65 : 100;
        const scaleRange = isMobile ? 20 : 35;
        const size = Math.floor(Math.random() * scaleRange) + baseSize;
        
        heart.style.fontSize = `${size}px`;
        heart.style.left = `${coords.x}%`;
        heart.style.top = `${coords.y}%`;
        heart.style.opacity = isMobile ? '0.35' : '0.45'; 
        
        container.appendChild(heart);
        
        gsap.to(heart, {
            y: Math.random() * -40 - 20, 
            x: Math.random() * 30 - 15,  
            rotation: Math.random() * 40 - 20, 
            duration: Math.random() * 2 + 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.2
        });
    });
}

function initStaticPeeker() {
    if (!peeker) return;
    peeker.textContent = "🦒";
    
    gsap.to(peeker, {
        y: "-=12",                  
        rotation: "+=3",            
        duration: 3.5,              
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    gsap.to(peeker, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out"
    });
}

// --- FOLYAMATOSAN ÉS GYORSAN SÉTÁLÓ ZSIRÁFOK ---
let walkTween, bobbingTween;
function startFamilyWalk() {
    if (walkTween) walkTween.kill();
    if (bobbingTween) bobbingTween.kill();

    const isMobile = window.innerWidth <= 600;
    const startX = isMobile ? -300 : -600; 
    const endX = window.innerWidth + 100; 
    
    gsap.set(family, { x: startX });
    
    bobbingTween = gsap.to('.family-member', {
        y: -15, 
        duration: isMobile ? 0.25 : 0.18, 
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    walkTween = gsap.to(family, {
        x: endX,
        duration: isMobile ? 7 : 10, 
        ease: 'none',
        onComplete: () => {
            bobbingTween.kill();
            setTimeout(startFamilyWalk, 50); 
        }
    });
}

function cycleHeartfulMessages() {
    bubble.textContent = loveMessages[Math.floor(Math.random() * loveMessages.length)];
    gsap.timeline()
        .to(bubble, { opacity: 1, y: -6, duration: 0.5, ease: 'power2.out' })
        .to(bubble, { opacity: 0, y: 0, duration: 0.5, delay: 3.0, ease: 'power2.in' });
}

function createCelebrationConfetti() {
    const colors = ['#ffffff', '#ffd700', '#ff6b8b', '#ffb3c6', '#fff3a1'];
    const count = window.innerWidth < 600 ? 15 : 35; 
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        confettiContainer.appendChild(confetti);
        
        gsap.to(confetti, {
            y: '105vh',
            x: `+=${Math.random() * 100 - 50}`,
            rotation: `+=${Math.random() * 540}`,
            duration: Math.random() * 2.5 + 3.5,
            ease: 'power1.out',
            onComplete: () => confetti.remove()
        });
    }
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        spawnDynamicEnvironment();
        startFamilyWalk();
        manageCarouselState(); // Átmretezésnél is figyeljük a Tinder állapotát
    }, 300);
});

// Inicializálás
spawnDynamicEnvironment();
initStaticPeeker(); 
startFamilyWalk();
manageCarouselState(); // Eldönti, hogy indít-e Tindert vagy hagyja statikusan

setInterval(cycleHeartfulMessages, 4500);
createCelebrationConfetti();
setInterval(createCelebrationConfetti, 6500);