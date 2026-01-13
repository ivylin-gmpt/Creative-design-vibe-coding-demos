
// Configuration
const CONFIG = {
    cardWidth: 528,
    gap: 40,
    totalItems: 25,
    friction: 0.95,
    speedFactor: 1.5,
    tiltFactor: 0.1
};

// Data storage for per-card random properties
let cardProperties = [];

// State
let state = {
    currentX: 0,
    targetX: 0,
    velocity: 0,
    isDragging: false,
    startX: 0,
    currentModalIndex: -1,
    currentFilteredData: []
};

// DOM Elements
const track = document.getElementById('carouselTrack');
const viewport = document.querySelector('.viewport');
const counter = document.getElementById('activeCounter');
const searchInput = document.getElementById('searchInput');

let allData = [];
let loopStarted = false;

function generateData() {
    const editorialPalette = ['#00441b', '#8b0000', '#00008b', '#f5f5dc']; // Green, Red, Blue, Cream
    const items = (typeof GALLERY_PROJECTS !== 'undefined') ? GALLERY_PROJECTS : [
        { title: "Demo Project", creator: "Vibe Coding", videoId: "5D4WpL0M-1I", desc: "Sample description.", link: "#" }
    ];

    return items.map((item, i) => ({
        ...item,
        id: i + 1,
        color: editorialPalette[i % editorialPalette.length],
        // Default to YouTube link if no specific link provided
        link: item.link || `https://www.youtube.com/watch?v=${item.videoId}`
    }));
}

function init() {
    allData = generateData();
    renderGallery(allData);

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();

        // Visual feedback for search container
        const container = searchInput.closest('.search-container');
        if (query.length > 0) {
            container.style.borderColor = "#fff";
        } else {
            container.style.borderColor = "rgba(255,255,255,0.5)";
        }

        state.currentFilteredData = allData.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.creator.toLowerCase().includes(query)
        );
        renderGallery(state.currentFilteredData);
    });
}

function renderGallery(data) {
    // Clear existing
    track.innerHTML = '';
    cardProperties = [];
    CONFIG.totalItems = data.length;
    // Store data for modal navigation
    state.currentFilteredData = data;

    const centerOffset = (window.innerWidth / 2) - (CONFIG.cardWidth / 2);
    state.currentX = centerOffset;
    state.targetX = centerOffset;
    state.velocity = 0;

    if (data.length === 0) {
        track.innerHTML = '<div style="color: #444; font-family: var(--font-mono); font-size: 0.8rem; letter-spacing: 0.2em; width: 100vw; text-align: center;">NO RESULTS FOUND</div>';
        return;
    }

    // Render Cards & Generate Randomness
    data.forEach((item, i) => {
        // Random Properties for Editorial feel
        const baseRotation = (Math.random() * 8) - 4; // ±4 degrees
        const asymmetricalOffset = (Math.random() * 60) - 30; // ±30px shift

        cardProperties.push({
            rotation: baseRotation,
            offset: asymmetricalOffset,
            data: item
        });

        const card = document.createElement('div');
        card.className = 'card';

        // Handle background: image or color
        const bgStyle = item.image
            ? `background-image: url('${item.image}'); background-size: cover; background-position: center;`
            : `background-color: ${item.color};`;

        card.innerHTML = `
            <div class="card-inner" style="${bgStyle} border: 1px solid rgba(255,255,255,0.1);">
                <div style="
                    display: flex; 
                    flex-direction: column;
                    justify-content: center; 
                    align-items: center; 
                    height: 100%; 
                    font-family: var(--font-heading);
                    font-weight: 800; 
                    color: ${item.color === '#f5f5dc' ? '#000' : '#fff'};
                    padding: 2rem;
                    text-align: center;
                ">
                    <div style="font-size: 8rem; line-height: 0.8; opacity: 0.8;">${item.id}</div>
                    <div style="font-size: 1.2rem; text-transform: uppercase; margin-top: 1rem; opacity: 0.6;">${item.creator}</div>
                </div> 
                <div style="
                    position: absolute; 
                    bottom: 1.5rem; 
                    left: 1.5rem; 
                    color: ${item.color === '#f5f5dc' ? '#000' : '#fff'}; 
                    font-family: var(--font-mono); 
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                ">${item.title}</div>
            </div>
        `;

        card.addEventListener('click', () => openArtifact(item));
        track.appendChild(card);
    });

    const totalWidth = (CONFIG.cardWidth + CONFIG.gap) * CONFIG.totalItems;
    track.style.width = `${totalWidth}px`;

    if (!loopStarted) {
        loopStarted = true;
        loop();
    }
}

// --- 2. PHYSICS ENGINE ---
function loop() {
    // 1. Physics: Drag & Momentum
    if (!state.isDragging) {
        state.velocity *= CONFIG.friction;
        state.targetX += state.velocity;
    }

    // Smooth Interpolation
    state.currentX += (state.targetX - state.currentX) * 0.1;

    // 2. Parallax & Tilt Logic
    // We update specific styles for cards based on their position relative to screen center
    const cards = document.querySelectorAll('.card');
    const centerX = window.innerWidth / 2;

    cards.forEach((card, index) => {
        const props = cardProperties[index];
        // Asymmetrical position
        const cardX = state.currentX + (index * (CONFIG.cardWidth + CONFIG.gap)) + props.offset;
        const cardCenter = cardX + (CONFIG.cardWidth / 2);

        const dist = cardCenter - centerX;
        const normalizedDist = dist / window.innerWidth;

        let rotateY = (normalizedDist * 40);
        let baseRot = props.rotation; // Stick to random ±4deg base
        let z = Math.abs(normalizedDist) * -200;
        let scale = 1;

        // Hover: Straighten (0 rot) and Scale up
        if (card.matches(':hover')) {
            rotateY = 0;
            baseRot = 0;
            z = 50;
            scale = 1.1;
        }

        card.style.transform = `
            translateX(${cardX}px) 
            perspective(1200px) 
            rotateY(${rotateY}deg)
            rotateZ(${baseRot}deg)
            translateZ(${z}px)
            scale(${scale})
        `;
    });

    // 3. Active Index Calculation
    const scrollDistance = ((window.innerWidth / 2) - (CONFIG.cardWidth / 2)) - state.currentX;
    const activeIndex = Math.round(scrollDistance / (CONFIG.cardWidth + CONFIG.gap));
    const clampedIndex = Math.max(0, Math.min(CONFIG.totalItems - 1, activeIndex));
    updateCounter(clampedIndex + 1);

    requestAnimationFrame(loop);
}

// --- 3. MODAL LOGIC ---
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalMedia = document.getElementById('modalMedia');
const modalTitle = document.getElementById('modalTitle');
const modalCreator = document.getElementById('modalCreator');
const modalDesc = document.getElementById('modalDesc');
const modalLink = document.getElementById('modalLink');
const modalNavPrev = document.getElementById('modalPrev');
const modalNavNext = document.getElementById('modalNext');
const modalNavCounter = document.getElementById('modalCounter');

function populateModal(item) {
    // 1. Populate Content
    modalTitle.textContent = item.title;
    modalCreator.textContent = item.creator;
    modalDesc.textContent = item.desc;
    modalLink.href = item.link;

    if (modalNavCounter) {
        const currentIdx = state.currentFilteredData.findIndex(i => i.id === item.id) + 1;
        modalNavCounter.textContent = `${String(currentIdx).padStart(2, '0')} / ${String(state.currentFilteredData.length).padStart(2, '0')}`;
    }

    // Update navigation button states
    updateNavButtonStates();

    // 2. Embed Video (Autoplay)
    modalMedia.innerHTML = `
        <div class="video-click-overlay" style="position: absolute; top:0; left:0; width:100%; height:100%; cursor: pointer; z-index: 10;"></div>
        <iframe 
            src="https://www.youtube.com/embed/${item.videoId}?autoplay=1&mute=0&controls=1&rel=0" 
            allow="autoplay; encrypted-media" 
            style="width:100%; height:100%; border:none;"
            allowfullscreen>
        </iframe>
    `;

    // 3. Navigation logic for video click
    const overlay = modalMedia.querySelector('.video-click-overlay');
    overlay.addEventListener('click', () => window.open(item.link, '_blank'));
}

function openArtifact(item) {
    if (state.isDragging && Math.abs(state.velocity) > 2) return; // Don't open if dragging fast

    state.currentModalIndex = state.currentFilteredData.findIndex(i => i.id === item.id);
    populateModal(item);

    // 4. Show Modal
    modal.classList.add('active');
}

function updateNavButtonStates() {
    if (!modalNavPrev || !modalNavNext) return;

    // Disable/hide buttons at edges
    if (state.currentModalIndex <= 0) {
        modalNavPrev.style.opacity = '0';
        modalNavPrev.style.pointerEvents = 'none';
    } else {
        modalNavPrev.style.opacity = '';
        modalNavPrev.style.pointerEvents = '';
    }

    if (state.currentModalIndex >= state.currentFilteredData.length - 1) {
        modalNavNext.style.opacity = '0';
        modalNavNext.style.pointerEvents = 'none';
    } else {
        modalNavNext.style.opacity = '';
        modalNavNext.style.pointerEvents = '';
    }
}

function navigateModal(direction) {
    if (state.currentFilteredData.length <= 1) return;

    // Check bounds
    const newIndex = state.currentModalIndex + direction;
    if (newIndex < 0 || newIndex >= state.currentFilteredData.length) return;

    const info = document.querySelector('.modal-info');

    // Transition out
    modalMedia.classList.add('content-updating');
    if (info) info.classList.add('content-updating');

    setTimeout(() => {
        state.currentModalIndex = newIndex;
        const nextItem = state.currentFilteredData[state.currentModalIndex];
        populateModal(nextItem);

        // Transition in
        setTimeout(() => {
            modalMedia.classList.remove('content-updating');
            if (info) info.classList.remove('content-updating');
        }, 50);
    }, 400);
}

modalNavPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateModal(-1);
});

modalNavNext.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateModal(1);
});

function closeModal() {
    modal.classList.remove('active');
    // Stop video
    modalMedia.innerHTML = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
        closeModal();
    }
});

// Close on Escape Key
window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowRight') {
        navigateModal(1);
    } else if (e.key === 'ArrowLeft') {
        navigateModal(-1);
    }
});

function updateCounter(idx) {
    if (counter) {
        if (CONFIG.totalItems === 0) {
            counter.textContent = `00 — 00`;
            return;
        }
        counter.textContent = `${String(idx).padStart(2, '0')} — ${String(CONFIG.totalItems).padStart(2, '0')}`;
    }
}

// --- 3. INPUT HANDLING ---
viewport.addEventListener('mousedown', e => {
    state.isDragging = true;
    state.startX = e.clientX;
    viewport.style.cursor = 'grabbing';
});

window.addEventListener('mouseup', () => {
    state.isDragging = false;
    viewport.style.cursor = 'grab';
});

window.addEventListener('mousemove', e => {
    if (!state.isDragging) return;

    const dx = e.clientX - state.startX;
    state.targetX += dx * CONFIG.speedFactor;
    state.velocity = dx * 0.5; // Add momentum

    state.startX = e.clientX;
});

// Init
init();
