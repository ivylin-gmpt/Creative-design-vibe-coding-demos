// 1. Constants & State
let state = {
    allData: [],
    currentFilteredData: [],
    activeCategory: 'All',
    searchQuery: '',
    isAnimating: false
};

// 2. DOM Elements
const gridContainer = document.getElementById('gridContainer');
const searchInput = document.getElementById('searchInput');
const chips = document.querySelectorAll('.chip');

// 3. Initialization
function init() {
    state.allData = generateData();
    state.currentFilteredData = [...state.allData];

    renderGrid();
    setupEventListeners();
    setupIntersectionObserver();

}

function generateData() {
    const items = (typeof GALLERY_PROJECTS !== 'undefined') ? GALLERY_PROJECTS : [];
    return items.map((item, i) => {
        return {
            ...item,
            id: i + 1,
            category: item.category || 'Pitch ideas',
            tags: item.tags || ['Concept'],
            status: item.status
        };
    });
}

function renderGrid() {
    gridContainer.innerHTML = '';

    if (state.currentFilteredData.length === 0) {
        gridContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 6rem; color: #555; font-size: 1.2rem;">NO IDEAS FOUND FOR THIS FILTER</div>';
        return;
    }

    state.currentFilteredData.forEach((item) => {
        const card = createCardElement(item);
        gridContainer.appendChild(card);
    });

    // Re-observe new cards for entrance animations
    setTimeout(setupIntersectionObserver, 50);
}

function createCardElement(item) {
    const card = document.createElement('div');
    card.className = 'card';

    const tagsHtml = item.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

    const imageContent = item.image
        ? `<img src="${item.image}" class="card-image" alt="${item.title}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">`
        : `<div style="width:100%; height:100%; background: #111; display:flex; align-items:center; justify-content:center; color:#333;">NO PREVIEW</div>`;

    // Only show status if it exists and is not "Prototype"
    const showStatus = item.status && item.status.toLowerCase() !== 'prototype';
    let statusHtml = '';

    if (showStatus) {
        const isFeatured = item.status.toLowerCase() === 'featured';
        const iconHtml = isFeatured ? `
            <svg class="featured-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#featured-gradient)"/>
                <defs>
                    <linearGradient id="featured-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FF5D5D"/>
                        <stop offset="0.5" stop-color="#5D5DFF"/>
                        <stop offset="1" stop-color="#52FBFF"/>
                    </linearGradient>
                </defs>
            </svg>
        ` : '';
        statusHtml = `<div class="card-status ${isFeatured ? 'status-featured' : ''}">${iconHtml}${item.status}</div>`;
    }

    card.innerHTML = `
        <div class="card-image-wrapper">
            ${statusHtml}
            ${imageContent}
        </div>
        <div class="card-meta">
            <div class="card-title-row">
                <span class="card-title-meta">${item.title}</span>
            </div>
            <p class="card-desc">${item.desc || 'No description provided for this creative concept.'}</p>
            <div class="card-footer">
                <div class="card-tags">${tagsHtml}</div>
                <span class="card-creator">${item.creator}</span>
            </div>
        </div>
    `;

    card.addEventListener('click', () => openArtifact(item));
    return card;
}

// 4. Filtering Logic
function applyFilters() {
    state.currentFilteredData = state.allData.filter(item => {
        const matchesCategory = state.activeCategory === 'All' ||
            (state.activeCategory === 'Featured' ? (item.status && item.status.toLowerCase() === 'featured') : item.category === state.activeCategory);
        const matchesSearch = item.title.toLowerCase().includes(state.searchQuery) ||
            item.creator.toLowerCase().includes(state.searchQuery) ||
            item.desc.toLowerCase().includes(state.searchQuery) ||
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(state.searchQuery)));
        return matchesCategory && matchesSearch;
    });

    renderGrid();
}

// 5. Entrance Animations
function setupIntersectionObserver() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card').forEach(card => observer.observe(card));
}

// 6. Interactions
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase();
        applyFilters();
    });

    // Category Chips
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.activeCategory = chip.getAttribute('data-filter');
            applyFilters();
        });
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

// 7. Modal Functions
const modal = document.getElementById('modal');
const modalCreator = document.getElementById('headerCreator');
const modalDesc = document.getElementById('modalDesc');
const headerLink = document.getElementById('headerLink');
const headerTitle = document.getElementById('headerTitle');
const btnPrev = document.getElementById('modalPrev');
const btnNext = document.getElementById('modalNext');

function openArtifact(item) {
    state.currentModalIndex = state.currentFilteredData.findIndex(i => i.id === item.id);
    populateModal(item);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling background
}

function populateModal(item) {
    const currentIdx = state.currentFilteredData.findIndex(i => i.id === item.id);
    const total = state.currentFilteredData.length;

    headerTitle.textContent = item.title;
    modalCreator.textContent = `${item.creator}`;
    modalDesc.textContent = item.desc || 'No description provided for this creative concept.';
    headerLink.href = item.link || '#';

    btnPrev.disabled = currentIdx === 0;
    btnNext.disabled = currentIdx === total - 1;

    // Handle Media
    if (item.videoUrl) {
        modalMedia.innerHTML = `
            <video src="${item.videoUrl}" autoplay loop muted playsinline class="viewer-video"></video>
        `;
        const video = modalMedia.querySelector('video');
        video.addEventListener('click', () => {
            if (video.paused) video.play();
            else video.pause();
        });
    } else if (item.image) {
        modalMedia.innerHTML = `
            <img src="${item.image}" class="viewer-video" style="object-fit: contain;">
        `;
    } else {
        modalMedia.innerHTML = `<div class="no-preview">NO PREVIEW</div>`;
    }
}

function navigateModal(direction) {
    if (state.isAnimating) return;
    const newIdx = state.currentModalIndex + direction;
    if (newIdx < 0 || newIdx >= state.currentFilteredData.length) return;

    state.isAnimating = true;
    populateModal(state.currentFilteredData[newIdx]);
    state.currentModalIndex = newIdx;

    setTimeout(() => {
        state.isAnimating = false;
    }, 500);
}

function closeModal() {
    modal.classList.remove('active');
    modalMedia.innerHTML = '';
    document.body.style.overflow = '';
}



init();
