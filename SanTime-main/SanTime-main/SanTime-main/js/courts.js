// ============================================
// SANTIME – Courts Page Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Wait for mock data to load
  if (typeof COURTS_DATA === 'undefined') {
    setTimeout(initCourtsPage, 500);
    return;
  }
  initCourtsPage();
});

let currentFilters = {
  sport: 'all',
  district: 'all',
  price: 'all',
  rating: 0,
  statusOnlyAvailable: false,
  search: ''
};

function initCourtsPage() {
  populateDistricts();
  setupEventListeners();
  renderCourts();
}

function populateDistricts() {
  const select = document.getElementById('districtFilter');
  if (!select) return;
  
  DISTRICTS.forEach(d => {
    const option = document.createElement('option');
    option.value = d;
    option.textContent = d;
    select.appendChild(option);
  });
}

function setupEventListeners() {
  // Search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      currentFilters.search = e.target.value.toLowerCase();
      renderCourts();
    }, 300));
  }

  // Sport filters
  const sportBtns = document.querySelectorAll('.sport-btn');
  sportBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      sportBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentFilters.sport = e.currentTarget.dataset.sport;
      renderCourts();
    });
  });

  // District filter
  const districtSelect = document.getElementById('districtFilter');
  if (districtSelect) {
    districtSelect.addEventListener('change', (e) => {
      currentFilters.district = e.target.value;
      renderCourts();
    });
  }

  // Price filters
  const priceRadios = document.querySelectorAll('input[name="price"]');
  priceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentFilters.price = e.target.value;
      renderCourts();
    });
  });

  // Rating filters
  const ratingBtns = document.querySelectorAll('#ratingFilter .btn');
  ratingBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      ratingBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentFilters.rating = parseFloat(e.currentTarget.dataset.rating);
      renderCourts();
    });
  });

  // Status filter
  const statusToggle = document.getElementById('statusFilter');
  if (statusToggle) {
    statusToggle.addEventListener('change', (e) => {
      currentFilters.statusOnlyAvailable = e.target.checked;
      renderCourts();
    });
  }

  // Reset filters
  const resetBtn = document.getElementById('resetFilters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Reset state
      currentFilters = { sport: 'all', district: 'all', price: 'all', rating: 0, statusOnlyAvailable: false, search: '' };
      
      // Reset UI
      if (searchInput) searchInput.value = '';
      sportBtns.forEach(b => b.classList.remove('active'));
      document.querySelector('.sport-btn[data-sport="all"]').classList.add('active');
      if (districtSelect) districtSelect.value = 'all';
      document.querySelector('input[name="price"][value="all"]').checked = true;
      ratingBtns.forEach(b => b.classList.remove('active'));
      document.querySelector('#ratingFilter .btn[data-rating="0"]').classList.add('active');
      if (statusToggle) statusToggle.checked = false;
      
      renderCourts();
    });
  }
}

function filterCourts() {
  return COURTS_DATA.filter(court => {
    // Search
    if (currentFilters.search) {
      const query = currentFilters.search;
      if (!court.name.toLowerCase().includes(query) && !court.address.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    // Sport
    if (currentFilters.sport !== 'all' && court.sport !== currentFilters.sport) return false;
    
    // District
    if (currentFilters.district !== 'all' && court.district !== currentFilters.district) return false;
    
    // Price
    if (currentFilters.price === 'under200' && court.dynamicPrice >= 200000) return false;
    if (currentFilters.price === '200to400' && (court.dynamicPrice < 200000 || court.dynamicPrice > 400000)) return false;
    if (currentFilters.price === 'over400' && court.dynamicPrice <= 400000) return false;
    
    // Rating
    if (court.rating < currentFilters.rating) return false;
    
    // Status
    if (currentFilters.statusOnlyAvailable && court.status !== 'available') return false;
    
    return true;
  });
}

function renderCourts() {
  const grid = document.getElementById('courtsGrid');
  const countEl = document.getElementById('resultCount');
  const noResults = document.getElementById('noResults');
  
  if (!grid || !countEl || !noResults) return;
  
  const filtered = filterCourts();
  countEl.textContent = `Hiển thị ${filtered.length} sân`;
  
  if (filtered.length === 0) {
    grid.innerHTML = '';
    grid.classList.add('hidden');
    noResults.classList.remove('hidden');
    return;
  }
  
  grid.classList.remove('hidden');
  noResults.classList.add('hidden');
  
  grid.innerHTML = filtered.map((court, index) => {
    const sportInfo = SPORTS_TYPES[court.sport];
    const delay = Math.min(index * 100, 500); // Stagger animation
    
    // Select first 3 facilities
    const facilitiesHTML = court.facilities.slice(0, 3).map(f => 
      `<span class="tag">${f}</span>`
    ).join('');
    
    const moreFacilities = court.facilities.length > 3 
      ? `<span class="tag" title="${court.facilities.slice(3).join(', ')}">+${court.facilities.length - 3}</span>`
      : '';
      
    return `
      <div class="card court-card fade-in visible" data-sport="${court.sport}" style="animation: slide-up 0.4s ease forwards ${delay}ms; opacity: 0;">
        <div class="court-card-banner">
          <div class="court-type-badge badge">
            ${sportInfo.icon} ${sportInfo.name}
          </div>
          <div class="court-card-icon">${sportInfo.icon}</div>
        </div>
        
        <div class="court-card-content">
          <h3 class="court-name" title="${court.name}">${court.name}</h3>
          
          <div class="court-address">
            <span class="text-tertiary">📍</span> ${court.address}
          </div>
          
          <div class="court-meta">
            <div class="rating">
              ${generateStars(court.rating)}
              <span class="rating-value">${court.rating}</span>
              <span class="text-sm text-tertiary ml-xs">(${court.reviews})</span>
            </div>
          </div>
          
          <div class="court-price mb-md">
            ${court.dynamicPrice < court.basePrice 
              ? `<span class="price-strike text-tertiary" style="text-decoration: line-through; font-size: 0.85em; margin-right: 8px;">${formatPrice(court.basePrice)}</span>
                 <span class="text-success" style="font-weight: 800; text-shadow: 0 0 10px rgba(0,230,118,0.5);">${formatPrice(court.dynamicPrice)}</span>`
              : court.dynamicPrice > court.basePrice 
              ? `<span class="text-error" style="font-weight: 800; text-shadow: 0 0 10px rgba(255,82,82,0.5);">${formatPrice(court.dynamicPrice)}</span>`
              : `<span class="text-primary">${formatPrice(court.dynamicPrice)}</span>`
            }
            <span class="text-sm text-tertiary font-normal"> / giờ</span>
          </div>
          
          ${court.aiPricingReason ? `
          <div class="ai-insight-box mb-sm" style="font-size: 11px; padding: 4px 8px; border-radius: 4px; background: rgba(0, 230, 118, 0.1); border: 1px solid rgba(0, 230, 118, 0.3); color: var(--primary);">
            <span style="margin-right: 4px;">⚡ AI:</span> ${court.aiPricingReason}
          </div>
          ` : ''}
          
          <div class="court-facilities">
            ${facilitiesHTML}
            ${moreFacilities}
          </div>
        </div>
        
        <div class="court-card-footer">
          <div class="flex flex-col">
            <span class="badge ${getStatusClass(court.status)} mb-xs" style="width: fit-content">${getStatusText(court.status)}</span>
            <span class="text-xs text-secondary">${court.fields} sân • ${court.type}</span>
          </div>
          <a href="booking.html?courtId=${court.id}" class="btn btn-primary btn-sm">Đặt sân</a>
        </div>
      </div>
    `;
  }).join('');
}
