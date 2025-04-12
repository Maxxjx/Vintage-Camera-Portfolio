// Get DOM elements
const filmStrip = document.getElementById('filmStrip');
const frameCounter = document.getElementById('frameCounter');
const frames = document.querySelectorAll('.frame');
const expandedView = document.getElementById('expandedView');
const expandedTitle = document.getElementById('expandedTitle');
const expandedBody = document.getElementById('expandedBody');
const expandedImage = document.getElementById('expandedImage');
const expandedText = document.getElementById('expandedText');
const closeButton = document.getElementById('closeButton');
const rewindLever = document.getElementById('rewindLever');
const modeButton = document.getElementById('mode-button');
const apertureButton = document.getElementById('aperture-button');
const shutterButton = document.getElementById('shutterButton');
const advanceButton = document.getElementById('advance-button');
const exposureFlash = document.getElementById('exposureFlash');

// Initialize variables
let currentFrameIndex = 0;
let isScrolling = false;
let lastScrollTime = Date.now();
let scrollTimeout;

// Film advance sound (would need to be implemented with actual audio)
function playAdvanceSound() {
    // This would play a subtle film advance click sound
    // const advanceSound = new Audio('path/to/advance-click.mp3');
    // advanceSound.volume = 0.2;
    // advanceSound.play();
}

// Update frame counter based on scroll position
function updateFrameCounter() {
    const scrollPosition = filmStrip.scrollTop;
    const viewportHeight = filmStrip.clientHeight;
    const totalHeight = filmStrip.scrollHeight - viewportHeight;
    
    // Calculate current frame based on scroll position
    let frameIndex = Math.floor((scrollPosition / totalHeight) * (frames.length - 1));
    frameIndex = Math.min(Math.max(frameIndex, 0), frames.length - 1);
    
    // Update counter with leading zero
    frameCounter.textContent = String(frameIndex + 1).padStart(2, '0');
    currentFrameIndex = frameIndex;
}

// Snap to closest frame after scrolling stops
function snapToFrame() {
    if (isScrolling) return;
    
    const frameHeight = filmStrip.scrollHeight / frames.length;
    const targetScrollPosition = currentFrameIndex * frameHeight;
    
    filmStrip.scrollTo({
        top: targetScrollPosition,
        behavior: 'smooth'
    });
}

// Flash effect when changing frames
function flashEffect() {
    exposureFlash.style.opacity = '0.5';
    setTimeout(() => {
        exposureFlash.style.opacity = '0';
    }, 100);
}

// Open expanded view for a frame
function openExpandedView(index) {
    const frame = frames[index];
    if (!frame.dataset.title) return;
    
    const title = frame.dataset.title;
    const content = frame.dataset.content;
    const image = frame.querySelector('.frame-image').style.backgroundImage;
    
    expandedTitle.textContent = title;
    expandedText.innerHTML = content;
    expandedImage.style.backgroundImage = image;
    
    flashEffect();
    setTimeout(() => {
        expandedView.style.display = 'flex';
    }, 200);
}

// Close expanded view
function closeExpandedView() {
    expandedView.style.display = 'none';
}

// Scroll to top (rewind)
function rewindFilm() {
    flashEffect();
    filmStrip.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add event listeners
filmStrip.addEventListener('scroll', () => {
    isScrolling = true;
    lastScrollTime = Date.now();
    
    updateFrameCounter();
    
    // Play sound effect occasionally while scrolling
    if (Math.random() < 0.1) {
        playAdvanceSound();
    }
    
    // Clear previous timeout and set new one
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (Date.now() - lastScrollTime >= 150) {
            isScrolling = false;
            snapToFrame();
        }
    }, 150);
});

// Click on a frame to expand
frames.forEach((frame, index) => {
    frame.addEventListener('click', () => {
        if (!frame.classList.contains('welcome-frame')) {
            openExpandedView(index);
        }
    });
});

// Close expanded view
closeButton.addEventListener('click', closeExpandedView);
expandedView.addEventListener('click', (e) => {
    if (e.target === expandedView) {
        closeExpandedView();
    }
});

// Rewind lever
rewindLever.addEventListener('click', rewindFilm);

// Camera controls
modeButton.addEventListener('click', () => {
    // Toggle between different visual modes (normal, high contrast, etc)
    document.body.classList.toggle('high-contrast-mode');
    modeButton.textContent = document.body.classList.contains('high-contrast-mode') ? 'ISO+' : 'ISO';
});

apertureButton.addEventListener('click', () => {
    // Toggle between light/dark mode
    document.body.classList.toggle('dark-mode');
    apertureButton.textContent = document.body.classList.contains('dark-mode') ? 'F/1.4' : 'F/2.8';
});

advanceButton.addEventListener('click', () => {
    // Advance to next frame
    if (currentFrameIndex < frames.length - 1) {
        currentFrameIndex++;
        const frameHeight = filmStrip.scrollHeight / frames.length;
        
        flashEffect();
        playAdvanceSound();
        
        filmStrip.scrollTo({
            top: currentFrameIndex * frameHeight,
            behavior: 'smooth'
        });
    }
});

// Initialize on page load
window.addEventListener('load', () => {
    updateFrameCounter();
    
    // Animate sprocket holes with scroll
    filmStrip.addEventListener('scroll', () => {
        const scrollY = filmStrip.scrollTop;
        document.querySelector('.sprocket-holes-left::after').style.transform = 
            `translateX(-50%) translateY(${-scrollY * 0.5}px)`;
        document.querySelector('.sprocket-holes-right::after').style.transform = 
            `translateX(-50%) translateY(${-scrollY * 0.5}px)`;
    });
});

// Key navigation
document.addEventListener