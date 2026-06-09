// ============================================
// SANTIME – System Admin Dashboard Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  if (typeof BOOKINGS_DATA === 'undefined') {
    setTimeout(initAdminDashboard, 500);
    return;
  }
  initAdminDashboard();
});

let allBookings = [];

function initAdminDashboard() {
  loadAllBookings();
  
  // Setup search
  document.getElementById('adminSearchInput').addEventListener('input', (e) => {
    renderAdminTable(e.target.value);
  });
}

window.loadAllBookings = function() {
  // 1. Get from Mock Data
  const mockBookings = [...BOOKINGS_DATA];
  
  // 2. Get from localStorage
  const localBookings = JSON.parse(localStorage.getItem('santime_bookings') || '[]');
    
  // Combine
  allBookings = [...mockBookings, ...localBookings];
  
  // Sort by newest first
  allBookings.sort((a,b) => b.id - a.id);
  
  renderAdminStats();
  renderAdminTable();
};

function renderAdminStats() {
  const statsContainer = document.getElementById('adminStats');
  
  const totalBookings = allBookings.length;
  const revenue = allBookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.totalPrice : 0), 0);
  const activeCourts = new Set(allBookings.map(b => b.courtId)).size;
  
  statsContainer.innerHTML = `
    <div class="stat-card card-glass fade-in visible">
      <div class="stat-icon" style="background: rgba(0, 176, 255, 0.1); color: var(--secondary)">📊</div>
      <div class="stat-content">
        <div class="stat-value text-secondary">${totalBookings}</div>
        <div class="stat-label">Tổng số lượt đặt</div>
      </div>
    </div>
    <div class="stat-card card-glass fade-in visible">
      <div class="stat-icon" style="background: rgba(0, 230, 118, 0.1); color: var(--primary)">💎</div>
      <div class="stat-content">
        <div class="stat-value text-primary">${formatPrice(revenue)}</div>
        <div class="stat-label">Tổng giao dịch</div>
      </div>
    </div>
    <div class="stat-card card-glass fade-in visible">
      <div class="stat-icon" style="background: rgba(255, 109, 0, 0.1); color: var(--accent)">🏟️</div>
      <div class="stat-content">
        <div class="stat-value text-accent">${activeCourts}/${COURTS_DATA.length}</div>
        <div class="stat-label">Sân đang hoạt động</div>
      </div>
    </div>
  `;
}

function renderAdminTable(filterText = '') {
  const tbody = document.getElementById('adminListTbody');
  
  let filtered = allBookings;
  if (filterText) {
    const text = filterText.toLowerCase();
    filtered = allBookings.filter(b => 
      (b.courtName || '').toLowerCase().includes(text) ||
      (b.code || '').toLowerCase().includes(text)
    );
  }
  
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-xl">Không tìm thấy dữ liệu.</td></tr>';
    return;
  }
  
  tbody.innerHTML = filtered.map(b => {
    // Get court info for owner phone
    const court = COURTS_DATA.find(c => c.id === b.courtId);
    const ownerPhone = court && court.ownerPhone ? court.ownerPhone : 'Chưa cập nhật';
    
    // Get player name
    let playerName = 'Khách (Vãng lai)';
    if (b.players && b.players.length > 0) {
      const p = PLAYERS_DATA.find(x => x.id === b.players[0]);
      if (p) playerName = p.name;
    } else if (b.id > 10000) { 
      playerName = 'Người dùng cục bộ';
    }

    return `
    <tr>
      <td><span class="text-tertiary">#</span>${b.code || b.id}</td>
      <td>
        <div class="font-medium text-primary">${b.courtName || (court ? court.name : 'Unknown')}</div>
        <div class="text-xs text-secondary mt-xs">📞 SĐT Chủ: ${ownerPhone}</div>
      </td>
      <td>${playerName}</td>
      <td>
        <div>📅 ${formatDisplayDate(b.date)}</div>
        <div class="text-xs text-secondary mt-xs">⏰ ${b.timeSlot}</div>
      </td>
      <td><span class="badge ${getStatusClass(b.status)}">${getStatusText(b.status)}</span></td>
      <td class="text-right font-bold text-lg">${formatPrice(b.totalPrice)}</td>
    </tr>
  `}).join('');
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
