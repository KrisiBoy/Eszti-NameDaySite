const container = document.getElementById('heart-container');
const giraffe = document.getElementById('giraffe');
const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');

// Mouse Interaction: Floating Hearts
window.addEventListener('mousemove', (e) => {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'heart';
    heart.style.left = e.pageX + 'px';
    heart.style.top = e.pageY + 'px';
    container.appendChild(heart);

    gsap.to(heart, { y: -100, opacity: 0, duration: 1.5, onComplete: () => heart.remove() });
});

// Giraffe Peeking Logic
gsap.to(giraffe, { bottom: 0, duration: 1, delay: 2, yoyo: true, repeat: -1, repeatDelay: 5 });

// Music Toggle
musicBtn.addEventListener('click', () => {
    music.paused ? music.play() : music.pause();
    musicBtn.innerText = music.paused ? "Play Our Song 🎵" : "Pause ⏸️";
});