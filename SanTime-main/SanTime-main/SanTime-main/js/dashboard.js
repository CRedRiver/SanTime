// ============================================
// SANTIME – Dashboard Page Logic
// ============================================

// Assume current user is id 1 (Nguyễn Văn Minh)
const USER_ID = 1;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof BOOKINGS_DATA === 'undefined') {
    setTimeout(initDashboard, 500);
    return;
  }
  initDashboard();
});

function initDashboard() {
  setDateHeader();
  renderProfile();
  renderMyBookings();
  renderUpcomingMatches();
  renderBookingHistory();
  renderActivityChart();
  renderTeam();
}

function setDateHeader() {
  const d = new Date();
  const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const str = `${days[d.getDay()]}, ngày ${String(d.getDate()).padStart(2,'0')} tháng ${String(d.getMonth()+1).padStart(2,'0')} năm ${d.getFullYear()}`;
  const el = document.getElementById('currentDateString');
  if (el) el.textContent = str;
}

function renderProfile() {
  const p = PLAYERS_DATA.find(x => x.id === USER_ID);
  if (!p) return;
  
  const avatarEl = document.getElementById('profileAvatar');
  if (avatarEl) {
    avatarEl.innerHTML = generateAvatarSVG(p.name, 80);
  }
}

function renderUpcomingMatches() {
  const container = document.getElementById('upcomingMatches');
  if (!container) return;
  
  // Get future matches involving the user
  const upcoming = BOOKINGS_DATA.filter(b => 
    b.players.includes(USER_ID) && 
    (b.status === 'confirmed' || b.status === 'pending')
  );
  
  if (upcoming.length === 0) {
    container.innerHTML = '<div class="text-center p-xl bg-card rounded-lg text-secondary">Bạn chưa có lịch đặt sân nào sắp tới.</div>';
    return;
  }
  
  container.innerHTML = upcoming.map((b, index) => {
    const sportInfo = SPORTS_TYPES[b.sport];
    const delay = index * 100;
    
    // Generate mini avatars for players
    const playersHtml = b.players.slice(0, 4).map(pid => {
      const p = PLAYERS_DATA.find(x => x.id === pid);
      return p ? generateAvatarSVG(p.name, 32).replace('<svg', '<svg class="avatar avatar-sm"') : '';
    }).join('');
    
    const morePlayers = b.players.length > 4 
      ? `<div class="avatar avatar-sm flex items-center justify-center bg-tertiary text-xs">+${b.players.length - 4}</div>` 
      : '';
      
    // Needs players? (assuming a match needs 10 players for football demo)
    const needsPlayers = b.players.length < 10 && b.sport === 'football'
      ? `<span class="badge badge-accent text-xs">Cần thêm ${10 - b.players.length} người</span>`
      : '';
    
    return `
      <div class="upcoming-card fade-in visible" style="animation: slide-up 0.4s ease forwards ${delay}ms; opacity: 0;">
        <div class="uc-main">
          <div class="uc-icon">${sportInfo.icon}</div>
          <div>
            <div class="uc-title">${b.courtName}</div>
            <div class="uc-meta">
              <span>📅 ${formatDisplayDate(b.date)}</span>
              <span>•</span>
              <span>⏰ ${b.timeSlot}</span>
            </div>
            <div class="mt-xs flex items-center gap-sm">
              <span class="badge ${getStatusClass(b.status)} text-xs">${getStatusText(b.status)}</span>
              ${needsPlayers}
            </div>
          </div>
        </div>
        
        <div class="flex flex-col items-end gap-sm mt-md md:mt-0">
          <div class="uc-players avatar-group">
            ${playersHtml}${morePlayers}
          </div>
          <div class="uc-actions">
            <button class="btn btn-secondary btn-sm" onclick="showBookingDetails(${b.id})">Chi tiết</button>
            ${b.status === 'pending' ? `<button class="btn btn-outline btn-sm text-error" onclick="cancelBooking(${b.id})">Hủy</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderBookingHistory() {
  const tbody = document.getElementById('historyTableBody');
  if (!tbody) return;
  
  // Sort descending by ID (simulating date sort)
  const history = [...BOOKINGS_DATA].sort((a,b) => b.id - a.id);
  
  tbody.innerHTML = history.map(b => `
    <tr>
      <td class="court-name">
        <div class="flex items-center gap-xs">
          <span>${SPORTS_TYPES[b.sport].icon}</span> ${b.courtName}
        </div>
      </td>
      <td>${formatDisplayDate(b.date)}</td>
      <td>${b.timeSlot}</td>
      <td><span class="badge ${getStatusClass(b.status)}">${getStatusText(b.status)}</span></td>
      <td>${b.paymentMethod}</td>
      <td class="text-right text-primary font-medium">${formatPrice(b.totalPrice)}</td>
    </tr>
  `).join('');
}

function renderActivityChart() {
  const container = document.getElementById('activityChart');
  if (!container) return;
  
  const months = ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6'];
  const values = [3, 5, 8, 6, 10, 7];
  const max = Math.max(...values);
  
  container.innerHTML = values.map((val, i) => {
    // Calculate height percentage (leaving room for labels)
    const height = Math.max((val / max) * 100, 10); // min 10% height
    
    return `
      <div class="chart-bar-group">
        <div class="chart-bar" style="height: ${height}%" data-val="${val} trận"></div>
        <div class="chart-label">${months[i]}</div>
      </div>
    `;
  }).join('');
}

function renderTeam() {
  const container = document.getElementById('myTeamList');
  if (!container) return;
  
  // Get some teammates (e.g., id 3, 5, 7, 9)
  const teamIds = [3, 5, 7, 9];
  
  container.innerHTML = teamIds.map(id => {
    const p = PLAYERS_DATA.find(x => x.id === id);
    if (!p) return '';
    return `
      <div class="team-member">
        ${generateAvatarSVG(p.name, 36)}
        <div class="tm-info">
          <div class="tm-name">${p.name}</div>
          <div class="tm-pos">${p.position}</div>
        </div>
        <div class="text-xs font-bold text-warning">${p.rating} ⭐</div>
      </div>
    `;
  }).join('');
}

function formatDisplayDate(dateStr) {
  const parts = dateStr.split('-');
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// Global actions
window.showBookingDetails = function(id) {
  const b = BOOKINGS_DATA.find(x => x.id === id);
  if (!b) return;
  
  const content = `
    <div class="bg-card p-md rounded-md border border-subtle">
      <div class="flex justify-between mb-sm"><span class="text-secondary">Sân:</span> <strong>${b.courtName}</strong></div>
      <div class="flex justify-between mb-sm"><span class="text-secondary">Môn:</span> <strong>${SPORTS_TYPES[b.sport].name}</strong></div>
      <div class="flex justify-between mb-sm"><span class="text-secondary">Ngày:</span> <strong>${formatDisplayDate(b.date)}</strong></div>
      <div class="flex justify-between mb-sm"><span class="text-secondary">Giờ:</span> <strong>${b.timeSlot}</strong></div>
      <div class="flex justify-between mb-sm"><span class="text-secondary">Trạng thái:</span> <span class="badge ${getStatusClass(b.status)}">${getStatusText(b.status)}</span></div>
      <div class="flex justify-between pt-sm border-t border-subtle mt-sm"><span class="text-secondary">Tổng tiền:</span> <strong class="text-primary text-lg">${formatPrice(b.totalPrice)}</strong></div>
    </div>
  `;
  
  showModal('Chi tiết đặt sân', content, [
    { label: 'Đóng', class: 'btn-secondary', onclick: 'closeModal()' }
  ]);
};

window.cancelBooking = function(id) {
  showModal('Xác nhận hủy', 'Bạn có chắc chắn muốn hủy lịch đặt sân này không? Hành động này không thể hoàn tác.', [
    { label: 'Không', class: 'btn-secondary', onclick: 'closeModal()' },
    { label: 'Có, hủy đặt sân', class: 'btn-outline text-error', onclick: `closeModal(); showToast('Đã hủy lịch đặt sân thành công', 'success'); setTimeout(() => location.reload(), 1500)` }
  ]);
};

// ============================================
// PERSONAL BOOKINGS (from localStorage)
// ============================================

function renderMyBookings() {
  const container = document.getElementById('myBookingsList');
  if (!container) return;
  
  const bookings = JSON.parse(localStorage.getItem('santime_bookings') || '[]');
  
  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="card-glass p-xl text-center">
        <div class="text-4xl mb-md">📭</div>
        <p class="text-secondary mb-md">Bạn chưa có lịch đặt sân nào.</p>
        <a href="courts.html" class="btn btn-primary">Đặt sân ngay</a>
      </div>
    `;
    return;
  }
  
  // Sort by newest first
  bookings.sort((a, b) => b.id - a.id);
  
  container.innerHTML = bookings.map((b, index) => {
    const sportInfo = SPORTS_TYPES[b.sport] || { icon: '🏟️', name: 'Thể thao', color: '#94A3B8' };
    const delay = index * 80;
    const displayDate = formatDisplayDate(b.date);
    
    // Status badge
    let statusClass = 'badge-primary';
    let statusText = 'Đã xác nhận';
    if (b.status === 'pending') { statusClass = 'badge-warning'; statusText = 'Chờ xác nhận'; }
    else if (b.status === 'cancelled') { statusClass = 'badge-error'; statusText = 'Đã hủy'; }
    else if (b.status === 'completed') { statusClass = 'badge-secondary'; statusText = 'Đã hoàn thành'; }
    
    // Parse time slots for display
    const timeSlots = b.timeSlot ? b.timeSlot.split('; ').filter(s => s.trim()) : [];
    const timeSlotsHtml = timeSlots.map(ts => 
      '<div class="my-booking-time-row">' + ts + '</div>'
    ).join('');
    
    return `
      <div class="my-booking-card fade-in visible" style="animation: slide-up 0.4s ease forwards ${delay}ms; opacity: 0; border-left: 4px solid ${sportInfo.color}">
        <div class="my-booking-header">
          <div class="my-booking-main">
            <div class="my-booking-sport-icon" style="background: ${sportInfo.color}20; color: ${sportInfo.color}">${sportInfo.icon}</div>
            <div>
              <div class="my-booking-court">${b.courtName}</div>
              <div class="my-booking-meta">
                <span>📅 ${displayDate}</span>
                <span class="text-tertiary">•</span>
                <span>💳 ${b.paymentMethod}</span>
              </div>
            </div>
          </div>
          <div class="my-booking-right">
            <div class="my-booking-price">${formatPrice(b.totalPrice)}</div>
            <span class="badge ${statusClass} text-xs">${statusText}</span>
          </div>
        </div>
        <div class="my-booking-details">
          <div class="my-booking-times">
            <span class="text-xs text-tertiary" style="font-weight:600">⏰ Khung giờ đặt:</span>
            ${timeSlotsHtml}
          </div>
          <div class="my-booking-footer">
            <span class="my-booking-code text-xs text-tertiary">Mã: <strong class="text-secondary">${b.code || '---'}</strong></span>
            <div class="my-booking-actions">
              <button class="btn btn-outline btn-sm text-error" onclick="removeMyBooking(${b.id})">Hủy đặt</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.removeMyBooking = function(id) {
  showModal('Xác nhận hủy đặt sân', 'Bạn có chắc chắn muốn hủy lịch đặt sân này? Hành động này không thể hoàn tác.', [
    { label: 'Không', class: 'btn-secondary', onclick: 'closeModal()' },
    { label: 'Có, hủy ngay', class: 'btn-outline text-error', onclick: `closeModal(); confirmRemoveBooking(${id})` }
  ]);
};

window.confirmRemoveBooking = function(id) {
  let bookings = JSON.parse(localStorage.getItem('santime_bookings') || '[]');
  bookings = bookings.filter(b => b.id !== id);
  localStorage.setItem('santime_bookings', JSON.stringify(bookings));
  showToast('Đã hủy lịch đặt sân thành công!', 'success');
  renderMyBookings();
};

window.clearMyBookings = function() {
  const bookings = JSON.parse(localStorage.getItem('santime_bookings') || '[]');
  if (bookings.length === 0) {
    showToast('Không có lịch đặt nào để xóa', 'info');
    return;
  }
  showModal('Xóa tất cả lịch đặt', 'Bạn có chắc chắn muốn xóa toàn bộ lịch đặt sân cá nhân? Hành động này không thể hoàn tác.', [
    { label: 'Hủy', class: 'btn-secondary', onclick: 'closeModal()' },
    { label: 'Xóa tất cả', class: 'btn-outline text-error', onclick: 'confirmClearAll()' }
  ]);
};

window.confirmClearAll = function() {
  closeModal();
  localStorage.removeItem('santime_bookings');
  showToast('Đã xóa tất cả lịch đặt', 'success');
  renderMyBookings();
};
