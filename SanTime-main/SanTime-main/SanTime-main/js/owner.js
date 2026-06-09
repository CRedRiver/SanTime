// ============================================
// SANTIME – Owner Dashboard Logic
// ============================================

const OWNER_COURT_ID = 1; // Giả lập tài khoản chủ sân sở hữu sân ID 1

document.addEventListener('DOMContentLoaded', () => {
  if (typeof BOOKINGS_DATA === 'undefined') {
    setTimeout(initOwnerDashboard, 500);
    return;
  }
  initOwnerDashboard();
});

let currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
let ownerBookings = [];

function initOwnerDashboard() {
  const court = COURTS_DATA.find(c => c.id === OWNER_COURT_ID);
  if (court) {
    document.getElementById('ownerCourtName').textContent = 'Quản lý Sân: ' + court.name;
  }

  // Initialize Date Picker
  flatpickr("#ownerDatePicker", {
    defaultDate: "today",
    dateFormat: "Y-m-d",
    locale: "vn",
    onChange: function(selectedDates, dateStr) {
      currentDate = dateStr;
      renderOwnerData();
    }
  });

  loadOwnerBookings();
  renderOwnerData();
}

function loadOwnerBookings() {
  // 1. Get from Mock Data (BOOKINGS_DATA)
  const mockBookings = BOOKINGS_DATA.filter(b => b.courtId === OWNER_COURT_ID);
  
  // 2. Get from localStorage
  const localBookings = JSON.parse(localStorage.getItem('santime_bookings') || '[]')
    .filter(b => b.courtId === OWNER_COURT_ID);
    
  // Combine
  ownerBookings = [...mockBookings, ...localBookings];
}

function renderOwnerData() {
  // Filter for current date
  const todaysBookings = ownerBookings.filter(b => b.date === currentDate);
  
  renderStats(todaysBookings);
  renderListView(todaysBookings);
  renderMatrixView(todaysBookings);
}

function renderStats(bookings) {
  const statsContainer = document.getElementById('ownerStats');
  
  const totalBookings = bookings.length;
  const revenue = bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.totalPrice : 0), 0);
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  
  statsContainer.innerHTML = `
    <div class="stat-card card-glass fade-in visible">
      <div class="stat-icon" style="background: rgba(0, 176, 255, 0.1); color: var(--secondary)">📅</div>
      <div class="stat-content">
        <div class="stat-value text-secondary">${totalBookings}</div>
        <div class="stat-label">Lượt đặt hôm nay</div>
      </div>
    </div>
    <div class="stat-card card-glass fade-in visible">
      <div class="stat-icon" style="background: rgba(0, 230, 118, 0.1); color: var(--primary)">💰</div>
      <div class="stat-content">
        <div class="stat-value text-primary">${formatPrice(revenue)}</div>
        <div class="stat-label">Doanh thu dự kiến</div>
      </div>
    </div>
    <div class="stat-card card-glass fade-in visible">
      <div class="stat-icon" style="background: rgba(255, 214, 0, 0.1); color: var(--warning)">✅</div>
      <div class="stat-content">
        <div class="stat-value text-warning">${confirmed}</div>
        <div class="stat-label">Đã xác nhận</div>
      </div>
    </div>
    
    <!-- AI PRICING WIDGET -->
    <div class="stat-card card-glass fade-in visible" style="border: 1px solid rgba(0, 230, 118, 0.3); background: rgba(0, 230, 118, 0.05); position: relative;">
      <div class="stat-icon" style="background: rgba(0, 230, 118, 0.2); color: var(--primary); animation: pulse 2s infinite;">🤖</div>
      <div class="stat-content" style="flex-grow: 1;">
        <div class="text-xs uppercase text-primary font-bold mb-xs">AI Đề xuất giá (Hôm nay)</div>
        <p class="text-sm text-secondary" style="line-height: 1.4;">"Dự báo mưa chiều tối. Khuyên giảm <strong>20%</strong> khung 16h-18h để lấp 2 sân trống."</p>
        <button class="btn btn-primary btn-sm mt-sm w-full" style="font-size: 11px; padding: 4px;" onclick="showToast('Đã áp dụng AI Pricing!', 'success')">Áp dụng tự động ⚡</button>
      </div>
    </div>
  `;
}

function renderListView(bookings) {
  const tbody = document.getElementById('ownerListTbody');
  
  if (bookings.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-xl">Không có lịch đặt nào trong ngày này.</td></tr>';
    return;
  }
  
  bookings.sort((a,b) => b.id - a.id);
  
  tbody.innerHTML = bookings.map(b => {
    // Get player name (for mock data we have player IDs, for local storage we might not)
    let playerName = 'Khách (Vãng lai)';
    if (b.players && b.players.length > 0) {
      const p = PLAYERS_DATA.find(x => x.id === b.players[0]);
      if (p) playerName = p.name;
    } else if (b.id > 10000) { // Local storage booking
      playerName = 'Nguyễn Văn Minh (Bạn)';
    }

    return `
    <tr>
      <td><span class="text-tertiary">#</span>${b.code || b.id}</td>
      <td class="font-medium text-primary">${playerName}</td>
      <td>${formatDisplayDate(b.date)}</td>
      <td>${b.timeSlot}</td>
      <td><span class="badge ${getStatusClass(b.status)}">${getStatusText(b.status)}</span></td>
      <td class="text-right font-bold">${formatPrice(b.totalPrice)}</td>
      <td class="text-center">
        <button class="btn btn-outline btn-sm" onclick="showToast('Tính năng đang phát triển', 'info')">Chi tiết</button>
      </td>
    </tr>
  `}).join('');
}

function renderMatrixView(bookings) {
  const container = document.getElementById('ownerMatrixContainer');
  const court = COURTS_DATA.find(c => c.id === OWNER_COURT_ID);
  const numFields = court ? court.fields : 4;
  
  let html = '';
  
  // Header row (times)
  html += '<div class="matrix-header">Sân / Giờ</div>';
  for (let i = 0; i < 48; i++) {
    const hour = Math.floor(i / 2);
    const min = i % 2 === 0 ? '00' : '30';
    html += `<div class="matrix-header">${hour.toString().padStart(2, '0')}:${min}</div>`;
  }
  
  // Rows for each field
  for (let fieldIndex = 1; fieldIndex <= numFields; fieldIndex++) {
    html += `<div class="matrix-row-label">Sân ${fieldIndex}</div>`;
    
    for (let slotIndex = 0; slotIndex < 48; slotIndex++) {
      // Determine time string for this slot
      const startHour = Math.floor(slotIndex / 2);
      const startMin = slotIndex % 2 === 0 ? '00' : '30';
      const endSlot = slotIndex + 1;
      const endHour = Math.floor(endSlot / 2);
      const endMin = endSlot % 2 === 0 ? '00' : '30';
      const timeStr = `${startHour.toString().padStart(2, '0')}:${startMin} - ${endHour.toString().padStart(2, '0')}:${endMin}`;
      
      // Check if this slot is booked
      let isBooked = false;
      let bookingInfo = '';
      
      // We parse the timeSlot string to find overlapping bookings.
      // This is a simplified check for demo purposes.
      for (const b of bookings) {
        if (b.status === 'cancelled') continue;
        if (b.timeSlot.includes(timeStr) && b.timeSlot.includes(`Sân ${fieldIndex}`)) {
          isBooked = true;
          bookingInfo = `Đã đặt (Mã: ${b.code || b.id})`;
          break;
        }
      }
      
      if (isBooked) {
        html += `<div class="matrix-cell booked" data-info="${bookingInfo}"></div>`;
      } else {
        html += `<div class="matrix-cell available"></div>`;
      }
    }
  }
  
  container.innerHTML = html;
}

window.setOwnerView = function(view) {
  document.getElementById('ownerListView').style.display = view === 'list' ? 'block' : 'none';
  document.getElementById('ownerMatrixView').style.display = view === 'matrix' ? 'block' : 'none';
  
  document.getElementById('btnViewList').className = view === 'list' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm';
  document.getElementById('btnViewMatrix').className = view === 'matrix' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm';
};

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
