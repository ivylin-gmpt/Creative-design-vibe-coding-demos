
// 1. Constants & State
const CONFIG = {
    cardWidth: '90vw',
    cardHeight: '50.625vw', // 16:9
    cycleDelay: 1800, // Time between swaps
    transitionDuration: 350,
    deckLayers: 5
};

let state = {
    allData: [],
    currentFilteredData: [],
    activeIndex: 0,
    isPaused: false,
    currentModalIndex: -1
};

// 2. DOM Elements
const stackActiveArea = document.getElementById('stackActiveArea');
const stackBackground = document.getElementById('stackBackground');
const counter = document.getElementById('activeCounter');
const searchInput = document.getElementById('searchInput');
let cycleInterval;

// 3. Initialization
function init() {
    state.allData = generateData();
    state.currentFilteredData = [...state.allData];

    renderDeck();
    updateCounter();

    // Initial card setup
    renderInitialCard();
    startCycle();

    // Event Listeners
    setupEventListeners();
}

function generateData() {
    const editorialPalette = ['#00441b', '#8b0000', '#00008b', '#f5f5dc'];
    const items = (typeof GALLERY_PROJECTS !== 'undefined') ? GALLERY_PROJECTS : [];

    return items.map((item, i) => ({
        ...item,
        id: i + 1,
        color: editorialPalette[i % editorialPalette.length],
        link: item.link || `https://www.youtube.com/watch?v=${item.videoId}`
    }));
}

function renderDeck() {
    stackBackground.innerHTML = '';
    for (let i = 1; i <= CONFIG.deckLayers; i++) {
        const layer = document.createElement('div');
        layer.className = 'deck-layer';
        // Offset upward and inset horizontally
        const yOffset = -i * 6;
        const scale = 1 - (i * 0.01);
        layer.style.transform = `translateY(${yOffset}px) scaleX(${scale})`;
        layer.style.backgroundColor = 'rgba(255,255,255,0.03)';
        layer.style.zIndex = CONFIG.deckLayers - i;
        stackBackground.appendChild(layer);
    }
}

function renderInitialCard() {
    if (state.currentFilteredData.length === 0) return;
    const item = state.currentFilteredData[state.activeIndex];
    const card = createCardElement(item);
    stackActiveArea.appendChild(card);
}

function createCardElement(item) {
    const card = document.createElement('div');
    card.className = 'card';

    const bgStyle = item.image
        ? `background-image: url('${item.image}'); background-size: cover; background-position: center;`
        : `background-color: ${item.color};`;

    card.innerHTML = `
        <div class="card-inner" style="${bgStyle} border: 1px solid rgba(255,255,255,0.1);">
            <div style="
                position: relative; z-index: 2;
                display: flex; flex-direction: column; justify-content: center; align-items: center; 
                height: 100%; font-family: 'Anton', sans-serif; font-weight: 800; 
                color: item.color === '#fff'}; text-align: center;
            ">
                <div style="font-size: 8rem; line-height: 0.8; opacity: 0.8;">${item.id}</div>
                <div style="font-size: 2rem; font-weight: 100; text-transform: uppercase; margin-top: 1rem; opacity: 0.6;">${item.title}</div>
            </div> 
            <div style="
                position: absolute; bottom: 1.5rem; left: 1.5rem; 
                z-index: 2;
                color: item.color === '#f5f5dc'}; 
                font-family: 'Inter', sans-serif; font-size: 0.8rem;
                text-transform: uppercase; letter-spacing: 0.1em;
            ">${item.creator}</div>
        </div>
    `;

    card.addEventListener('click', () => openArtifact(item));
    return card;
}

// 4. Animation Cycle
function startCycle() {
    clearInterval(cycleInterval);
    if (state.currentFilteredData.length <= 1) return;

    cycleInterval = setInterval(() => {
        if (!state.isPaused) {
            nextCard();
        }
    }, CONFIG.cycleDelay);
}

function nextCard() {
    const outgoingCard = stackActiveArea.querySelector('.card:not(.card-incoming)');
    if (!outgoingCard) return;

    // Increment index
    state.activeIndex = (state.activeIndex + 1) % state.currentFilteredData.length;
    updateCounter();

    const nextItem = state.currentFilteredData[state.activeIndex];
    const incomingCard = createCardElement(nextItem);

    // Apply animation classes
    outgoingCard.classList.add('card-outgoing');
    incomingCard.classList.add('card-incoming');

    stackActiveArea.appendChild(incomingCard);

    // Cleanup after transition
    setTimeout(() => {
        if (outgoingCard.parentNode === stackActiveArea) {
            stackActiveArea.removeChild(outgoingCard);
        }
        incomingCard.classList.remove('card-incoming');
    }, CONFIG.transitionDuration);
}

// 5. Interactions & UI
function setupEventListeners() {
    // Hover pause
    const container = document.getElementById('stackTrack');
    container.addEventListener('mouseenter', () => state.isPaused = true);
    container.addEventListener('mouseleave', () => state.isPaused = false);

    // Search
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();

        state.currentFilteredData = state.allData.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.creator.toLowerCase().includes(query)
        );

        resetStack();
    });

    // Modal Events
    modalClose.addEventListener('click', closeModal);
    document.getElementById('modalPrev').addEventListener('click', () => navigateModal(-1));
    document.getElementById('modalNext').addEventListener('click', () => navigateModal(1));

    window.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') navigateModal(1);
        if (e.key === 'ArrowLeft') navigateModal(-1);
    });
}

function resetStack() {
    clearInterval(cycleInterval);
    stackActiveArea.innerHTML = '';
    state.activeIndex = 0;

    if (state.currentFilteredData.length === 0) {
        stackActiveArea.innerHTML = '<div style="color: #444; font-family: sans-serif; font-size: 0.8rem; letter-spacing: 0.2em; text-align: center; width: 100%;">NO RESULTS FOUND</div>';
    } else {
        renderInitialCard();
        startCycle();
    }
    updateCounter();
}

function updateCounter() {
    if (!counter) return;
    const current = state.currentFilteredData.length === 0 ? 0 : state.activeIndex + 1;
    const total = state.currentFilteredData.length;
    counter.textContent = `${String(current).padStart(2, '0')} — ${String(total).padStart(2, '0')}`;
}

// 6. Modal Functions (Re-adapted)
const modal = document.getElementById('modal');
const modalMedia = document.getElementById('modalMedia');
const modalTitle = document.getElementById('modalTitle');
const modalCreator = document.getElementById('modalCreator');
const modalDesc = document.getElementById('modalDesc');
const modalLink = document.getElementById('modalLink');
const modalNavCounter = document.getElementById('modalCounter');
const modalInfo = document.querySelector('.modal-info');
const btnPrev = document.getElementById('modalPrev');
const btnNext = document.getElementById('modalNext');

function openArtifact(item) {
    state.currentModalIndex = state.currentFilteredData.findIndex(i => i.id === item.id);
    populateModal(item);
    modal.classList.add('active');
}

function populateModal(item) {
    const currentIdx = state.currentFilteredData.findIndex(i => i.id === item.id);

    modalTitle.textContent = item.title;
    modalCreator.textContent = item.creator;
    modalDesc.textContent = item.desc;
    modalLink.href = item.link;

    if (modalNavCounter) {
        modalNavCounter.textContent = `${String(currentIdx + 1).padStart(2, '0')} / ${String(state.currentFilteredData.length).padStart(2, '0')}`;
    }

    // Update Nav Buttons
    btnPrev.disabled = currentIdx === 0;
    btnNext.disabled = currentIdx === state.currentFilteredData.length - 1;

    if (item.videoUrl) {
        modalMedia.innerHTML = `
            <video src="${item.videoUrl}" 
                   autoplay 
                   loop 
                   muted 
                   playsinline 
                   style="width:100%; height:100%; object-fit: cover;">
            </video>
        `;
    } else {
        modalMedia.innerHTML = `
            <iframe src="https://www.youtube.com/watch?v=qFLhGq0060w&list=RDqFLhGq0060w&start_radio=1" 
                    allow="autoplay; encrypted-media" style="width:100%; height:100%; border:none;" allowfullscreen></iframe>
        `;
    }
}

function navigateModal(direction) {
    if (state.isAnimating) return;
    const newIdx = state.currentModalIndex + direction;
    if (newIdx < 0 || newIdx >= state.currentFilteredData.length) return;

    state.isAnimating = true;

    // Start transition
    modalMedia.classList.add('content-updating');
    modalInfo.classList.add('content-updating');

    setTimeout(() => {
        state.currentModalIndex = newIdx;
        populateModal(state.currentFilteredData[state.currentModalIndex]);

        // Small delay to allow content to "settle" before fading in
        setTimeout(() => {
            modalMedia.classList.remove('content-updating');
            modalInfo.classList.remove('content-updating');
            state.isAnimating = false;
        }, 50);
    }, 400); // Sync with CSS transition
}

function closeModal() {
    modal.classList.remove('active');
    modalMedia.innerHTML = '';
}

// Boot
init();
