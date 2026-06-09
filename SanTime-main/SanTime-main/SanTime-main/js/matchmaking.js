// ============================================
// SANTIME – Matchmaking Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  if (typeof PLAYERS_DATA === 'undefined') {
    setTimeout(initMatchmaking, 500);
    return;
  }
  initMatchmaking();
});

let currentSport = 'football';
let matchingTimer = null;

function initMatchmaking() {
  populateDistricts();
  setupFormListeners();
  renderLeaderboard();
  
  // Set initial sport icon for radar
  updateRadarIcon();
}

function populateDistricts() {
  const select = document.getElementById('districtSelect');
  if (!select) return;
  DISTRICTS.forEach(d => {
    const option = document.createElement('option');
    option.value = d;
    option.textContent = d;
    select.appendChild(option);
  });
}

function setupFormListeners() {
  // Sport selection
  const sportBtns = document.querySelectorAll('.sport-select-btn');
  sportBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      sportBtns.forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      currentSport = target.dataset.sport;
      updateRadarIcon();
      
      // Update position options based on sport
      const posGroup = document.getElementById('positionGroup');
      const posSelect = document.getElementById('positionSelect');
      
      if (currentSport === 'football') {
        posGroup.classList.remove('hidden');
        posSelect.innerHTML = `
          <option value="all">Bất kỳ vị trí nào</option>
          <option value="Tiền đạo">Tiền đạo</option>
          <option value="Tiền vệ">Tiền vệ</option>
          <option value="Hậu vệ">Hậu vệ</option>
          <option value="Thủ môn">Thủ môn</option>
        `;
      } else if (currentSport === 'volleyball') {
        posGroup.classList.remove('hidden');
        posSelect.innerHTML = `
          <option value="all">Bất kỳ vị trí nào</option>
          <option value="Chủ công">Chủ công</option>
          <option value="Phụ công">Phụ công</option>
          <option value="Chuyền hai">Chuyền hai</option>
          <option value="Libero">Libero</option>
        `;
      } else if (currentSport === 'basketball') {
        posGroup.classList.remove('hidden');
        posSelect.innerHTML = `
          <option value="all">Bất kỳ vị trí nào</option>
          <option value="Point Guard">Hậu vệ dẫn bóng (PG)</option>
          <option value="Shooting Guard">Hậu vệ ghi điểm (SG)</option>
          <option value="Small Forward">Tiền phong phụ (SF)</option>
          <option value="Power Forward">Tiền phong chính (PF)</option>
          <option value="Center">Trung phong (C)</option>
        `;
      } else {
        // Hide for badminton, tennis
        posGroup.classList.add('hidden');
      }
    });
  });

  // Time selection
  const timeBtns = document.querySelectorAll('.time-btn');
  timeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      timeBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });

  // Start matching
  const startBtn = document.getElementById('startMatchBtn');
  if (startBtn) {
    startBtn.addEventListener('click', startMatchingProcess);
  }
  
  // Rematch
  const rematchBtn = document.getElementById('rematchBtn');
  if (rematchBtn) {
    rematchBtn.addEventListener('click', () => {
      document.getElementById('resultsSection').classList.add('hidden');
      document.getElementById('matchingForm').classList.remove('hidden');
    });
  }
}

function updateRadarIcon() {
  const radarIcon = document.getElementById('radarIcon');
  if (radarIcon && SPORTS_TYPES[currentSport]) {
    radarIcon.textContent = SPORTS_TYPES[currentSport].icon;
  }
}

function startMatchingProcess() {
  const form = document.getElementById('matchingForm');
  const animation = document.getElementById('matchingAnimation');
  const results = document.getElementById('resultsSection');
  
  // Hide form, show animation
  form.classList.add('hidden');
  animation.classList.remove('hidden');
  results.classList.add('hidden');
  
  // Simulate AI matching delay
  clearTimeout(matchingTimer);
  matchingTimer = setTimeout(() => {
    animation.classList.add('hidden');
    showResults();
  }, 2500);
}

function showResults() {
  const results = document.getElementById('resultsSection');
  const grid = document.getElementById('playersGrid');
  const title = document.getElementById('resultsTitle');
  
  results.classList.remove('hidden');
  
  // Hàm tạo mock data động
  const generateFakePlayers = (sport, level, district, position, count) => {
    const fakePlayers = [];
    const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Ngô', 'Dương'];
    const middleNames = ['Văn', 'Thị', 'Đức', 'Hoàng', 'Minh', 'Ngọc', 'Thanh', 'Hữu', 'Quang', 'Hải', 'Tuấn', 'Thành'];
    const lastNames = ['Anh', 'Bảo', 'Cường', 'Dũng', 'Đạt', 'Huy', 'Khoa', 'Long', 'Minh', 'Nam', 'Phong', 'Quân', 'Sơn', 'Tuấn'];
    
    for(let i=0; i<count; i++) {
      const name = `${firstNames[Math.floor(Math.random()*firstNames.length)]} ${middleNames[Math.floor(Math.random()*middleNames.length)]} ${lastNames[Math.floor(Math.random()*lastNames.length)]}`;
      
      let pDistrict = district !== 'all' ? district : DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)];
      let pLevel = level !== 'all' ? level : ['Mới bắt đầu', 'Trung bình', 'Trung bình khá', 'Khá', 'Giỏi', 'Chuyên nghiệp'][Math.floor(Math.random()*6)];
      
      let pPosition = position !== 'all' ? position : '';
      if (pPosition === '') {
        if (sport === 'football') pPosition = ['Tiền đạo', 'Tiền vệ', 'Hậu vệ', 'Thủ môn'][Math.floor(Math.random()*4)];
        else if (sport === 'volleyball') pPosition = ['Chủ công', 'Phụ công', 'Chuyền hai', 'Libero'][Math.floor(Math.random()*4)];
        else if (sport === 'basketball') pPosition = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'][Math.floor(Math.random()*5)];
        else pPosition = 'Cầu thủ';
      }
      
      fakePlayers.push({
        id: Math.floor(Math.random() * 10000) + 100,
        name: name,
        age: Math.floor(Math.random() * 15) + 18,
        sport: sport,
        position: pPosition,
        level: pLevel,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        matches: Math.floor(Math.random() * 100) + 5,
        district: pDistrict,
        avatar: null,
        bio: 'Người chơi đam mê thể thao, luôn tìm kiếm những trận đấu thú vị trên SanTime.',
        available: true,
        knnDistance: 0 // Hoàn hảo vì được tạo ra để khớp
      });
    }
    return fakePlayers;
  };
  
  // Get filters
  const targetLevel = document.getElementById('levelSelect').value;
  const targetDistrict = document.getElementById('districtSelect').value;
  const playStyleSelect = document.getElementById('playStyleSelect');
  const targetPlayStyle = playStyleSelect ? playStyleSelect.value : 'all';
  
  const posSelect = document.getElementById('positionSelect');
  const targetPosition = posSelect && !posSelect.parentElement.classList.contains('hidden') ? posSelect.value : 'all';
  
  // Filter by sport first
  let matched = PLAYERS_DATA.filter(p => p.sport === currentSport);
  
  // Helper to map level to numerical value for distance calculation
  const getLevelValue = (lvl) => {
    const map = { 'Mới bắt đầu': 1, 'Trung bình': 2, 'Trung bình khá': 3, 'Khá': 4, 'Giỏi': 5, 'Chuyên nghiệp': 6 };
    return map[lvl] || 3;
  };
  
  const targetLevelValue = targetLevel !== 'all' ? getLevelValue(targetLevel) : null;

  // --- SIMPLE KNN ALGORITHM ---
  // Calculate distance between user's criteria and each player
  matched.forEach(p => {
    let distance = 0;
    
    // 1. Level Distance (Weight: 2.0)
    if (targetLevelValue !== null) {
      const pLevel = getLevelValue(p.level);
      const levelDiff = Math.abs(pLevel - targetLevelValue) / 5; // Normalize 0-1
      distance += levelDiff * 2.0; 
    }
    
    // 2. District Distance (Weight: 1.0)
    if (targetDistrict !== 'all' && p.district !== targetDistrict) {
      distance += 1.0; 
    }
    
    // 3. Position Distance (Weight: 1.5)
    if (targetPosition !== 'all' && p.position !== targetPosition) {
      distance += 1.5; 
    }
    
    // 4. Play Style Distance (Weight: 3.0) - AI HEAVY WEIGHT
    let playStyleMatch = 0; // 0 means perfect match, 1 means no match
    if (targetPlayStyle !== 'all') {
      if (!p.playStyles || !p.playStyles.includes(targetPlayStyle)) {
        playStyleMatch = 1;
        distance += 3.0; // Heavy penalty if play style doesn't match
      }
    }
    
    // Calculate a 'Compatibility Score' based on max possible distance (2.0 + 1.0 + 1.5 + 3.0 = 7.5)
    const maxDist = 7.5;
    p.compatibility = Math.round(Math.max(0, 100 - (distance / maxDist) * 100));
    
    p.knnDistance = distance;
  });
  
  // Sort by closest distance
  matched.sort((a, b) => a.knnDistance - b.knnDistance);
  
  // Take Top K matches (K=6)
  const K = 6;
  matched = matched.slice(0, K);
  
  // NẾU KHÔNG ĐỦ KẾT QUẢ THỰC TẾ, FALLBACK SANG MOCK DATA
  if (matched.length < K) {
    const needed = K - matched.length;
    const fakeData = generateFakePlayers(currentSport, targetLevel, targetDistrict, targetPosition, needed);
    matched = [...matched, ...fakeData];
  }
  
  title.textContent = `Tìm thấy ${matched.length} người chơi phù hợp!`;
  
  if (matched.length === 0) {
    grid.innerHTML = '<div class="col-span-full text-center py-xl text-secondary">Không tìm thấy người chơi nào phù hợp. Hãy thử thay đổi bộ lọc.</div>';
    return;
  }
  
  grid.innerHTML = matched.map((p, index) => {
    const delay = index * 100;
    const isOnline = Math.random() > 0.3; // 70% chance online
    const sportInfo = SPORTS_TYPES[p.sport];
    
    return `
      <div class="card card-glass player-card fade-in visible" style="animation: slide-up 0.4s ease forwards ${delay}ms; opacity: 0;">
        <div class="player-header">
          <div class="relative">
            ${generateAvatarSVG(p.name, 56)}
            <div class="player-status ${isOnline ? 'online' : 'offline'}" title="${isOnline ? 'Đang online' : 'Offline'}"></div>
          </div>
          <div class="player-info flex-grow">
            <h3>${p.name}</h3>
            <div class="player-meta">
              <span title="Tuổi">${p.age} tuổi</span> • 
              <span title="Khu vực">📍 ${p.district}</span>
            </div>
            <div class="mt-xs">
              <span class="badge" style="background: ${getLevelColor(p.level)}20; color: ${getLevelColor(p.level)}; border-color: ${getLevelColor(p.level)}40">
                ${p.level}
              </span>
            </div>
          </div>
        </div>
        
        <div class="mt-md mb-sm">
          <div class="flex justify-between items-center mb-xs">
            <span class="text-xs uppercase text-tertiary">Độ hợp rơ (AI Score)</span>
            <span class="text-sm font-bold ${p.compatibility >= 90 ? 'text-accent' : 'text-primary'}">${p.compatibility || 85}% ${p.compatibility >= 90 ? '🔥' : ''}</span>
          </div>
          <div class="w-full bg-tertiary rounded-full h-1.5">
            <div class="bg-gradient-primary h-1.5 rounded-full" style="width: ${p.compatibility || 85}%"></div>
          </div>
        </div>
        
        <div class="player-stats">
          <div class="player-stat-col">
            <span class="player-stat-val">${sportInfo.icon} ${p.position || 'Cầu thủ'}</span>
            <span class="player-stat-lbl">Vị trí</span>
          </div>
          <div class="player-stat-col">
            <span class="player-stat-val text-warning">${p.rating} ⭐</span>
            <span class="player-stat-lbl">${p.matches} trận</span>
          </div>
        </div>
        
        ${p.aiInsight ? `
        <div class="ai-insight-box mt-sm mb-sm" style="font-size: 12px; padding: 8px; border-radius: 6px; background: rgba(0, 176, 255, 0.1); border: 1px solid rgba(0, 176, 255, 0.3); color: var(--secondary);">
          <span style="font-weight:700;">🤖 AI Phân tích:</span> ${p.aiInsight}
        </div>
        ` : ''}
        
        <p class="text-sm text-secondary mb-lg line-clamp-2" style="flex-grow:1" title="${p.bio}">
          "${p.bio}"
        </p>
        
        <div class="player-actions">
          <button class="btn btn-secondary btn-sm" onclick="viewProfile(${p.id})">Xem hồ sơ</button>
          <button class="btn btn-primary btn-sm" onclick="invitePlayer('${p.name}')">Mời vào đội</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderLeaderboard() {
  const list = document.getElementById('leaderboardList');
  if (!list) return;
  
  // Sort by rating then matches
  const topPlayers = [...PLAYERS_DATA]
    .sort((a, b) => b.rating - a.rating || b.matches - a.matches)
    .slice(0, 5);
    
  list.innerHTML = topPlayers.map((p, index) => {
    let rankClass = '';
    if (index === 0) rankClass = 'gold';
    else if (index === 1) rankClass = 'silver';
    else if (index === 2) rankClass = 'bronze';
    
    return `
      <div class="lb-item">
        <div class="lb-rank ${rankClass}">#${index + 1}</div>
        ${generateAvatarSVG(p.name, 32)}
        <div class="lb-info">
          <div class="lb-name">${p.name}</div>
          <div class="lb-meta">${SPORTS_TYPES[p.sport].icon} ${p.district}</div>
        </div>
        <div class="lb-rating">${p.rating}</div>
      </div>
    `;
  }).join('');
}

// Global actions for onclick
window.invitePlayer = function(name) {
  showToast(`Đã gửi lời mời ghép đội đến ${name}!`, 'success');
};

window.viewProfile = function(id) {
  const p = PLAYERS_DATA.find(x => x.id === id);
  if (!p) return;
  
  const content = `
    <div class="flex gap-lg items-center mb-lg">
      ${generateAvatarSVG(p.name, 80)}
      <div>
        <h3 class="text-2xl">${p.name}</h3>
        <p class="text-secondary">${p.age} tuổi • ${p.district}</p>
        <div class="mt-sm">
          <span class="badge badge-primary">${SPORTS_TYPES[p.sport].icon} ${SPORTS_TYPES[p.sport].name}</span>
          <span class="badge" style="background: ${getLevelColor(p.level)}20; color: ${getLevelColor(p.level)};">${p.level}</span>
        </div>
      </div>
    </div>
    
    <div class="grid-2 gap-md mb-lg text-center">
      <div class="card-glass p-sm">
        <div class="text-xl font-bold text-warning">${p.rating} ⭐</div>
        <div class="text-xs text-secondary uppercase">Đánh giá</div>
      </div>
      <div class="card-glass p-sm">
        <div class="text-xl font-bold">${p.matches}</div>
        <div class="text-xs text-secondary uppercase">Trận đã tham gia</div>
      </div>
    </div>
    
    <div class="mb-lg">
      <h4 class="mb-sm text-sm uppercase text-tertiary">Giới thiệu</h4>
      <p class="text-secondary bg-card p-md rounded-md">"${p.bio}"</p>
    </div>
  `;
  
  showModal('Hồ sơ người chơi', content, [
    { label: 'Đóng', class: 'btn-secondary', onclick: 'closeModal()' },
    { label: 'Mời vào đội', class: 'btn-primary', onclick: `closeModal(); invitePlayer('${p.name}')` }
  ]);
};
