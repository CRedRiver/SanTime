// ============================================
// SANTIME – Booking Page Logic
// ============================================

let currentCourt = null;
let selectedDate = null;
let selectedBlocks = [];
let isSelecting = false;
let startCell = null;
let peopleCount = 10;
let courtPrice = 0;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof COURTS_DATA === 'undefined') {
    setTimeout(initBookingPage, 500);
    return;
  }
  initBookingPage();
});

function initBookingPage() {
  loadCourtData();
  if (!currentCourt) return;
  
  renderCourtDetails();
  initMap();
  initCalendarPicker();
  generateMatrix();
  renderReviews();
  renderRelatedCourts();
  
  setupEventListeners();
  updateSummary();
}

// ============================================
// INTERACTIVE MAP – Leaflet.js + OpenStreetMap
// ============================================

const COURT_COORDS = {
  1:  { lat: 21.0048, lng: 105.8434 },
  2:  { lat: 21.0380, lng: 105.7970 },
  3:  { lat: 21.0130, lng: 105.8220 },
  4:  { lat: 20.9930, lng: 105.8150 },
  5:  { lat: 21.0290, lng: 105.7900 },
  6:  { lat: 21.0460, lng: 105.7870 },
  7:  { lat: 21.0000, lng: 105.8470 },
  8:  { lat: 21.0450, lng: 105.8730 },
  9:  { lat: 21.0070, lng: 105.8310 },
  10: { lat: 20.9720, lng: 105.7740 },
  11: { lat: 21.0360, lng: 105.8260 },
  12: { lat: 20.9810, lng: 105.8410 }
};

let leafletMap = null;

function initMap() {
  const mapEl = document.getElementById('leafletMap');
  if (!mapEl || typeof L === 'undefined') return;

  const defaultCoords = COURT_COORDS[currentCourt ? currentCourt.id : 1] || { lat: 21.0285, lng: 105.8542 };

  leafletMap = L.map('leafletMap', {
    center: [defaultCoords.lat, defaultCoords.lng],
    zoom: 14,
    zoomControl: true,
    attributionControl: false
  });

  // Use Google Maps with explicit Vietnamese localization (hl=vi) for accurate names and Biển Đông
  L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi', {
    maxZoom: 19
  }).addTo(leafletMap);

  L.control.attribution({ position: 'bottomright', prefix: false })
    .addAttribution('© <a href="https://www.openstreetmap.org/copyright" target="_blank" style="color:#64748B">OSM</a>')
    .addTo(leafletMap);

  // Add markers for all courts
  COURTS_DATA.forEach(c => {
    const coords = COURT_COORDS[c.id];
    if (!coords) return;
    const sportInfo = SPORTS_TYPES[c.sport];
    const isCurrent = currentCourt && c.id === currentCourt.id;
    const color = isCurrent ? '#00E676' : (sportInfo ? sportInfo.color : '#94A3B8');

    // Pulsing ring for current court
    if (isCurrent) {
      L.circleMarker([coords.lat, coords.lng], {
        radius: 22, color: '#00E676', fillColor: '#00E676',
        fillOpacity: 0.12, weight: 2, opacity: 0.3
      }).addTo(leafletMap);
    }

    // Main marker
    const marker = L.circleMarker([coords.lat, coords.lng], {
      radius: isCurrent ? 12 : 8,
      color: color, fillColor: color,
      fillOpacity: isCurrent ? 0.9 : 0.7,
      weight: isCurrent ? 3 : 2, opacity: 1
    }).addTo(leafletMap);

    // Tooltip
    marker.bindTooltip(
      (sportInfo ? sportInfo.icon : '') + ' ' + c.name,
      { permanent: isCurrent, direction: 'top', offset: [0, -10], className: 'map-tooltip' + (isCurrent ? ' map-tooltip-current' : '') }
    );

    // Popup on click
    const popupHTML = '<div style="min-width:220px">'
      + '<div style="font-size:1.3rem;margin-bottom:4px">' + (sportInfo ? sportInfo.icon : '') + ' <strong>' + c.name + '</strong></div>'
      + '<div style="color:#94A3B8;font-size:13px;margin-bottom:6px">📍 ' + c.address + '</div>'
      + '<div style="display:flex;gap:12px;font-size:13px;margin-bottom:8px">'
      + '<span style="color:#FFD600">★ ' + c.rating + '</span>'
      + '<span style="color:#00E676;font-weight:600">' + formatPrice(c.dynamicPrice || c.basePrice) + '/h</span>'
      + '<span>' + getStatusText(c.status) + '</span></div>'
      + (isCurrent
        ? '<span style="color:#00E676;font-size:13px;font-weight:600">📌 Bạn đang xem sân này</span>'
        : '<a href="booking.html?courtId=' + c.id + '" style="display:inline-block;padding:6px 16px;background:#00E676;color:#0A0E17;border-radius:8px;font-weight:600;font-size:13px;text-decoration:none">Đặt sân này →</a>')
      + '</div>';

    marker.bindPopup(popupHTML, { maxWidth: 300, className: 'map-popup-dark' });
    marker.on('click', () => showMapPopup(c.id));
  });

  if (currentCourt) showMapPopup(currentCourt.id);
}

function showMapPopup(courtId) {
  const popup = document.getElementById('mapCourtInfo');
  if (!popup) return;
  const c = COURTS_DATA.find(x => x.id === courtId);
  if (!c) return;
  const sportInfo = SPORTS_TYPES[c.sport];
  const isCurrent = currentCourt && c.id === currentCourt.id;
  popup.classList.remove('hidden');
  popup.innerHTML = '<div class="court-popup-icon">' + sportInfo.icon + '</div>'
    + '<div class="court-popup-body">'
    + '<div class="court-popup-name">' + c.name + (isCurrent ? ' <span class="badge badge-primary" style="font-size:10px;vertical-align:middle">Đang xem</span>' : '') + '</div>'
    + '<div class="court-popup-addr">📍 ' + c.address + '</div>'
    + '<div class="court-popup-meta">'
    + '<span class="text-warning">' + generateStars(c.rating) + ' ' + c.rating + '</span>'
    + '<span class="text-tertiary">•</span>'
    + '<span class="text-primary font-medium">' + formatPrice(c.dynamicPrice || c.basePrice) + '/h</span>'
    + '<span class="text-tertiary">•</span>'
    + '<span>' + getStatusText(c.status) + '</span>'
    + '</div></div>'
    + (isCurrent ? '' : '<a href="booking.html?courtId=' + c.id + '" class="btn btn-primary btn-sm" style="flex-shrink:0">Đặt sân này</a>');
}

// ============================================
// BOOKING PAGE LOGIC
// ============================================

function loadCourtData() {
  const urlParams = new URLSearchParams(window.location.search);
  const courtId = parseInt(urlParams.get('courtId')) || 1;
  currentCourt = COURTS_DATA.find(c => c.id === courtId);
  if (currentCourt) {
    courtPrice = currentCourt.dynamicPrice || currentCourt.basePrice;
  }
}

function renderCourtDetails() {
  if (!currentCourt) return;
  const sportInfo = SPORTS_TYPES[currentCourt.sport];

  document.getElementById('breadcrumbName').textContent = currentCourt.name;
  document.getElementById('courtName').textContent = currentCourt.name;
  const courtIconTitle = document.getElementById('courtIconTitle');
  if (courtIconTitle) courtIconTitle.textContent = sportInfo.icon;
  document.getElementById('courtAddress').textContent = currentCourt.address;
  document.getElementById('courtSportBadge').innerHTML = sportInfo.icon + ' ' + sportInfo.name;
  
  if (currentCourt.aiPricingReason) {
    const aiReasonHtml = `<div class="ai-insight-box mt-sm mb-sm" style="font-size: 13px; padding: 6px 12px; border-radius: 6px; background: rgba(0, 230, 118, 0.1); border: 1px solid rgba(0, 230, 118, 0.3); color: var(--primary);">
      <span style="margin-right: 4px;">⚡ AI Pricing:</span> ${currentCourt.aiPricingReason}
    </div>`;
    const headerTitle = document.querySelector('.court-header-title');
    if (headerTitle && !document.querySelector('.ai-insight-box')) {
      headerTitle.insertAdjacentHTML('beforeend', aiReasonHtml);
    }
  }

  const statusBadge = document.getElementById('courtStatusBadge');
  statusBadge.className = 'badge ' + getStatusClass(currentCourt.status);
  statusBadge.textContent = getStatusText(currentCourt.status);

  document.getElementById('courtRatingStars').innerHTML = generateStars(currentCourt.rating);
  document.getElementById('courtRatingVal').textContent = currentCourt.rating;
  document.getElementById('courtReviewCount').textContent = currentCourt.reviews;

  document.getElementById('courtDescription').textContent = currentCourt.description;
  document.getElementById('courtHours').textContent = currentCourt.openTime + ' - ' + currentCourt.closeTime;
  document.getElementById('courtFields').textContent = currentCourt.fields + ' sân';
  document.getElementById('courtType').textContent = currentCourt.type;

  const facilitiesEl = document.getElementById('courtFacilities');
  facilitiesEl.innerHTML = currentCourt.facilities.map(f => '<span class="tag bg-card border-default p-sm rounded-md">' + f + '</span>').join('');
}

function initCalendarPicker() {
  const pickerEl = document.getElementById('calendarPicker');
  if (!pickerEl || typeof flatpickr === 'undefined') return;

  const mockToday = new Date(2026, 4, 27);
  // Default format is YYYY-MM-DD for value
  selectedDate = mockToday.getFullYear() + '-' + String(mockToday.getMonth()+1).padStart(2,'0') + '-' + String(mockToday.getDate()).padStart(2,'0');

  flatpickr(pickerEl, {
    defaultDate: mockToday,
    minDate: "today", // Or mockToday if we want to restrict to our mock time
    dateFormat: "d/m/Y",
    locale: "vn",
    theme: "dark",
    onChange: function(selectedDates, dateStr, instance) {
      if (selectedDates.length > 0) {
        const d = selectedDates[0];
        selectedDate = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
        generateMatrix();
        selectedBlocks = [];
        updateSummary();
      }
    }
  });
}

function formatTimeLabel(idx) {
  const h = Math.floor(idx / 2);
  const m = (idx % 2 === 0) ? '00' : '30';
  return String(h).padStart(2, '0') + ':' + m;
}

function generateMatrix() {
  const container = document.getElementById('timeMatrix');
  if (!container) return;
  if (!currentCourt) return;

  const fieldsCount = currentCourt.fields || 1;
  const numBlocks = 48; // 30 min intervals in 24h
  
  let seed = selectedDate ? selectedDate.charCodeAt(selectedDate.length - 1) : 1;

  let html = '<table class="matrix-table"><thead><tr><th class="matrix-td-field">Sân \\ Giờ</th>';
  for (let c = 0; c < numBlocks; c++) {
    html += '<th class="matrix-th-time">' + formatTimeLabel(c) + '</th>';
  }
  html += '</tr></thead><tbody>';

  for (let r = 1; r <= fieldsCount; r++) {
    html += '<tr><td class="matrix-td-field">Sân ' + r + '</td>';
    for (let c = 0; c < numBlocks; c++) {
      // Remove mock booked data so users can select freely
      const isBooked = false;
      const classList = 'matrix-cell ' + (isBooked ? 'booked' : 'available');
      const timeLabel = formatTimeLabel(c);
      
      html += '<td class="' + classList + '" '
           + 'data-field="' + r + '" '
           + 'data-timeidx="' + c + '" '
           + 'data-timelabel="' + timeLabel + '" '
           + 'title="Sân ' + r + ' - ' + timeLabel + '"></td>';
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  container.innerHTML = html;
  
  setupMatrixInteractions();
}

function setupMatrixInteractions() {
  const wrapper = document.getElementById('matrixWrapper');
  if (!wrapper) return;

  let dragStartIndex = { r: -1, c: -1 };
  
  const cells = wrapper.querySelectorAll('.matrix-cell:not(.booked)');
  
  const clearSelecting = () => wrapper.querySelectorAll('.selecting').forEach(el => el.classList.remove('selecting'));
  
  const applySelection = (r1, c1, r2, c2) => {
    const minR = Math.min(r1, r2);
    const maxR = Math.max(r1, r2);
    const minC = Math.min(c1, c2);
    const maxC = Math.max(c1, c2);
    
    cells.forEach(cell => {
      const r = parseInt(cell.dataset.field);
      const c = parseInt(cell.dataset.timeidx);
      if (r >= minR && r <= maxR && c >= minC && c <= maxC) {
        cell.classList.add('selecting');
      } else {
        cell.classList.remove('selecting');
      }
    });
  };

  const commitSelection = () => {
    const selected = wrapper.querySelectorAll('.selecting');
    selected.forEach(cell => {
      cell.classList.remove('selecting');
      // Toggle logic
      if (cell.classList.contains('selected')) {
        cell.classList.remove('selected');
        selectedBlocks = selectedBlocks.filter(b => !(b.field === cell.dataset.field && b.timeidx === cell.dataset.timeidx));
      } else {
        cell.classList.add('selected');
        selectedBlocks.push({
          field: cell.dataset.field,
          timeidx: cell.dataset.timeidx,
          label: cell.dataset.timelabel
        });
      }
    });
    updateSummary();
  };

  cells.forEach(cell => {
    cell.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Only left click
      isSelecting = true;
      const r = parseInt(cell.dataset.field);
      const c = parseInt(cell.dataset.timeidx);
      dragStartIndex = { r, c };
      applySelection(r, c, r, c);
      
      // Prevent text selection while dragging
      e.preventDefault();
    });
    
    cell.addEventListener('mouseenter', () => {
      if (isSelecting) {
        const r = parseInt(cell.dataset.field);
        const c = parseInt(cell.dataset.timeidx);
        applySelection(dragStartIndex.r, dragStartIndex.c, r, c);
      }
    });
  });

  document.addEventListener('mouseup', () => {
    if (isSelecting) {
      isSelecting = false;
      commitSelection();
    }
    if (isDraggingScroll) {
      isDraggingScroll = false;
      wrapper.style.cursor = 'grab';
    }
  });

  // --- Drag to Scroll (Panning) Logic ---
  let isDraggingScroll = false;
  let scrollStartX = 0;
  let scrollLeft = 0;

  wrapper.addEventListener('mousedown', (e) => {
    // If clicked on a cell, don't start scrolling (let cell selection handle it)
    if (e.target.closest('.matrix-cell')) return;
    
    // If clicked on the native horizontal scrollbar, let the browser handle it
    if (e.offsetY >= wrapper.clientHeight) return;
    
    isDraggingScroll = true;
    scrollStartX = e.pageX - wrapper.offsetLeft;
    scrollLeft = wrapper.scrollLeft;
    wrapper.style.cursor = 'grabbing';
  });

  wrapper.addEventListener('mouseleave', () => {
    isDraggingScroll = false;
    wrapper.style.cursor = 'grab';
  });

  wrapper.addEventListener('mousemove', (e) => {
    if (!isDraggingScroll) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    const walk = (x - scrollStartX) * 1.5; // Scroll speed multiplier
    wrapper.scrollLeft = scrollLeft - walk;
  });
}



function updateSummary() {
  document.getElementById('summaryDate').textContent = selectedDate ? formatDisplayDate(selectedDate) : 'Chưa chọn';
  
  const timeStr = selectedBlocks.length > 0 
    ? selectedBlocks.length + ' block (30p)' 
    : 'Chưa chọn';
  document.getElementById('summaryTime').textContent = timeStr;
  
  const blockPrice = courtPrice / 2; // Price per 30 mins
  document.getElementById('summaryPrice').textContent = formatPrice(blockPrice) + '/30p';

  const total = selectedBlocks.length * blockPrice;
  document.getElementById('summaryTotal').textContent = formatPrice(total);

  const btnBook = document.getElementById('btnBookNow');
  if (selectedDate && selectedBlocks.length > 0) {
    btnBook.removeAttribute('disabled');
  } else {
    btnBook.setAttribute('disabled', 'true');
  }
}

window.updatePeople = function(delta) {
  const input = document.getElementById('peopleCount');
  let val = parseInt(input.value) + delta;
  if (val >= parseInt(input.min) && val <= parseInt(input.max)) {
    input.value = val;
    peopleCount = val;
  }
};

function formatDisplayDate(dateStr) {
  const parts = dateStr.split('-');
  return parts[2] + '/' + parts[1] + '/' + parts[0];
}

function setupEventListeners() {
  document.getElementById('btnBookNow').addEventListener('click', () => {
    const payment = document.querySelector('input[name="payment"]:checked').value;
    const paymentName = payment === 'vnpay' ? 'VNPay' : (payment === 'momo' ? 'MoMo' : 'Tiền mặt');
    const blockPrice = courtPrice / 2;
    const total = selectedBlocks.length * blockPrice;
    const bookingCode = '#ST' + Math.floor(Math.random()*10000);
    
    // Group blocks by field for clean display
    const groups = {};
    selectedBlocks.forEach(b => {
      if(!groups[b.field]) groups[b.field] = [];
      groups[b.field].push(b.label);
    });
    
    let timeDisplay = '';
    let timeDisplayPlain = '';
    for (const f in groups) {
      groups[f].sort();
      timeDisplay += '<div>Sân ' + f + ': ' + groups[f].join(', ') + '</div>';
      timeDisplayPlain += 'Sân ' + f + ': ' + groups[f].join(', ') + '; ';
    }

    // --- Save booking to localStorage ---
    const booking = {
      id: Date.now(),
      code: bookingCode,
      courtId: currentCourt.id,
      courtName: currentCourt.name,
      sport: currentCourt.sport,
      date: selectedDate,
      timeSlot: timeDisplayPlain.trim(),
      blocks: selectedBlocks.length,
      paymentMethod: paymentName,
      totalPrice: total,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    const saved = JSON.parse(localStorage.getItem('santime_bookings') || '[]');
    saved.push(booking);
    localStorage.setItem('santime_bookings', JSON.stringify(saved));

    const content = '<div class="text-center mb-lg">'
      + '<div class="text-5xl mb-sm">✅</div>'
      + '<h3 class="text-xl text-primary">Xác nhận đặt sân thành công!</h3></div>'
      + '<div class="bg-card p-md rounded-md mb-md border border-subtle">'
      + '<div class="flex justify-between mb-sm"><span class="text-secondary">Sân:</span> <strong>' + currentCourt.name + '</strong></div>'
      + '<div class="flex justify-between mb-sm"><span class="text-secondary">Ngày:</span> <strong>' + formatDisplayDate(selectedDate) + '</strong></div>'
      + '<div class="flex flex-col mb-sm"><span class="text-secondary mb-xs">Giờ đặt:</span> <strong style="font-size: 13px; line-height: 1.6; text-align: right;">' + timeDisplay + '</strong></div>'
      + '<div class="flex justify-between mb-sm"><span class="text-secondary">Thanh toán:</span> <strong>' + paymentName + '</strong></div>'
      + '<div class="flex justify-between pt-sm border-t border-subtle mt-sm"><span class="text-secondary">Tổng tiền:</span> <strong class="text-primary text-lg">' + formatPrice(total) + '</strong></div></div>'
      + '<p class="text-sm text-tertiary text-center">Mã đặt sân: <strong class="text-secondary">' + bookingCode + '</strong>. Thông tin chi tiết đã được gửi qua email của bạn.</p>';

    showModal('Chi tiết đặt sân', content, [
      { label: 'Đóng', class: 'btn-secondary', onclick: 'closeModal()' },
      { label: 'Xem lịch đặt', class: 'btn-primary', onclick: "window.location.href='dashboard.html'" }
    ]);
  });
}

function renderReviews() {
  const container = document.getElementById('reviewsList');
  if (!container) return;

  const reviews = REVIEWS_DATA.filter(r => r.courtId === currentCourt.id);

  if (reviews.length === 0) {
    container.innerHTML = '<p class="text-secondary italic">Chưa có đánh giá nào cho sân này.</p>';
    return;
  }

  container.innerHTML = reviews.map(r =>
    '<div class="review-item">'
    + '<div class="flex justify-between items-start mb-sm">'
    + '<div class="flex items-center gap-sm">'
    + generateAvatarSVG(r.userName, 40)
    + '<div><div class="font-medium">' + r.userName + '</div>'
    + '<div class="text-xs text-tertiary">' + formatDisplayDate(r.date) + '</div></div></div>'
    + '<div class="rating">' + generateStars(r.rating) + '</div></div>'
    + '<p class="text-secondary text-sm">"' + r.comment + '"</p></div>'
  ).join('');
}

function renderRelatedCourts() {
  const container = document.getElementById('relatedCourts');
  if (!container) return;

  const related = COURTS_DATA.filter(c => c.sport === currentCourt.sport && c.id !== currentCourt.id).slice(0, 3);

  if (related.length === 0) {
    container.parentElement.classList.add('hidden');
    return;
  }

  container.innerHTML = related.map(c =>
    '<a href="booking.html?courtId=' + c.id + '" class="card card-glass flex gap-sm items-center hover-glow" style="padding: var(--space-sm)">'
    + '<div style="width:60px;height:60px;border-radius:var(--radius-sm);background:var(--bg-tertiary);display:flex;align-items:center;justify-content:center;font-size:1.5rem">'
    + SPORTS_TYPES[c.sport].icon + '</div>'
    + '<div class="flex-grow">'
    + '<div class="font-medium line-clamp-1">' + c.name + '</div>'
    + '<div class="text-xs text-secondary mb-xs">📍 ' + c.district + '</div>'
    + '<div class="text-primary text-sm">' + formatPrice(c.dynamicPrice || c.basePrice) + '</div></div></a>'
  ).join('');
}
