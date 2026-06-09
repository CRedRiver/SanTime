// ============================================
// SANTIME – Shared App Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initMobileMenu();
  initCounterAnimations();
  initChatWidget();
  initRoleSelection();
  initAdminButton();
});

// ---- Navbar Scroll Effect ----
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href.endsWith(currentPage) || (currentPage === 'index.html' && href === '/' ))) {
      link.classList.add('active');
    }
  });
}

// ---- Mobile Menu ----
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      toggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// ---- Scroll Animations (Intersection Observer) ----
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in, .stagger-children');

  if (!animatedElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

// ---- Counter Animations ----
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-counter'));
  const suffix = element.getAttribute('data-suffix') || '';
  const prefix = element.getAttribute('data-prefix') || '';
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(eased * target);

    element.textContent = prefix + current.toLocaleString('vi-VN') + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ---- Toast Notifications ----
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;top:90px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;';
    document.body.appendChild(container);
  }

  const icons = { success: '✓', error: '✗', warning: '⚠', info: 'ℹ' };
  const colors = {
    success: 'var(--primary)',
    error: 'var(--error)',
    warning: 'var(--warning)',
    info: 'var(--secondary)'
  };

  const toast = document.createElement('div');
  toast.style.cssText = `
    display:flex;align-items:center;gap:10px;padding:14px 20px;
    background:rgba(26,31,46,0.95);backdrop-filter:blur(20px);
    border:1px solid ${colors[type]};border-radius:12px;
    color:var(--text-primary);font-size:14px;font-weight:500;
    box-shadow:0 4px 20px rgba(0,0,0,0.4);
    animation:slide-up 0.3s ease;min-width:280px;max-width:400px;
  `;
  toast.innerHTML = `
    <span style="color:${colors[type]};font-size:18px;font-weight:700;">${icons[type]}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ---- Modal ----
function showModal(title, content, actions = []) {
  // Remove existing modal
  const existing = document.getElementById('app-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'app-modal';
  modal.style.cssText = `
    position:fixed;top:0;left:0;right:0;bottom:0;
    background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);
    display:flex;align-items:center;justify-content:center;
    z-index:var(--z-modal);padding:20px;
    animation:fadeIn 0.2s ease;
  `;

  const actionsHTML = actions.map(a =>
    `<button class="btn ${a.class || 'btn-secondary'}" onclick="${a.onclick}">${a.label}</button>`
  ).join('');

  modal.innerHTML = `
    <div style="background:var(--bg-secondary);border:1px solid var(--border-default);border-radius:var(--radius-xl);
      padding:var(--space-xl);max-width:500px;width:100%;animation:slide-up 0.3s ease;max-height:80vh;overflow-y:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg);">
        <h4>${title}</h4>
        <button onclick="closeModal()" style="color:var(--text-tertiary);font-size:24px;cursor:pointer;background:none;border:none;">✕</button>
      </div>
      <div style="color:var(--text-secondary);line-height:1.6;margin-bottom:var(--space-xl);">${content}</div>
      ${actionsHTML ? `<div style="display:flex;gap:12px;justify-content:flex-end;">${actionsHTML}</div>` : ''}
    </div>
  `;

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('app-modal');
  if (modal) {
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.2s ease';
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 200);
  }
}

// ---- Smooth scroll to section ----
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ---- Utility: debounce ----
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ---- Generate Navbar HTML ----
function getNavbarHTML(basePath = '') {
  const role = localStorage.getItem('santime_role') || 'player';
  let dashboardLink = `<a href="${basePath}pages/dashboard.html">Dashboard</a>`;
  if (role === 'owner') {
    dashboardLink = `<a href="${basePath}pages/owner.html" class="text-primary font-bold">Quản lý sân</a>`;
  }

  return `
  <nav class="navbar" id="navbar">
    <div class="container">
      <a href="${basePath}index.html" class="navbar-brand">
        <div class="brand-icon">⚡</div>
        San<span>Time</span>
      </a>
      <div class="nav-links" id="nav-links">
        <a href="${basePath}index.html">Trang chủ</a>
        <a href="${basePath}pages/courts.html">Tìm sân</a>
        <a href="${basePath}pages/matchmaking.html">Ghép đội</a>
        <a href="${basePath}pages/booking.html">Đặt sân</a>
        ${dashboardLink}
        <a href="${basePath}pages/about.html">Về chúng tôi</a>
      </div>
      <div class="nav-cta">
        <a href="${basePath}pages/matchmaking.html" class="btn btn-primary btn-sm">Ghép đội ngay</a>
      </div>
      <div class="menu-toggle" id="menu-toggle">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </nav>`;
}

// ---- Generate Footer HTML ----
function getFooterHTML(basePath = '') {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="${basePath}index.html" class="navbar-brand">
            <div class="brand-icon">⚡</div>
            San<span>Time</span>
          </a>
          <p>Nền tảng kết nối người chơi thể thao và đặt sân hàng đầu Việt Nam. Chơi ngay, không chờ đợi!</p>
        </div>
        <div class="footer-col">
          <h4>Sản phẩm</h4>
          <a href="${basePath}pages/courts.html">Tìm sân</a>
          <a href="${basePath}pages/matchmaking.html">Ghép đội</a>
          <a href="${basePath}pages/booking.html">Đặt sân</a>
          <a href="${basePath}pages/dashboard.html">Dashboard</a>
        </div>
        <div class="footer-col">
          <h4>Về SanTime</h4>
          <a href="${basePath}pages/about.html">Giới thiệu</a>
          <a href="#">Blog</a>
          <a href="#">Tuyển dụng</a>
          <a href="#">Liên hệ</a>
        </div>
        <div class="footer-col">
          <h4>Hỗ trợ</h4>
          <a href="#">Trung tâm trợ giúp</a>
          <a href="#">Điều khoản sử dụng</a>
          <a href="#">Chính sách bảo mật</a>
          <a href="#">FAQ</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 SanTime. Đại học Bách Khoa Hà Nội – CH2021.</span>
        <div class="footer-social">
          <a href="#" aria-label="Facebook">f</a>
          <a href="#" aria-label="Instagram">ig</a>
          <a href="#" aria-label="TikTok">tk</a>
          <a href="#" aria-label="Zalo">z</a>
        </div>
      </div>
    </div>
  </footer>`;
}

// ---- Chat Widget ----
function initChatWidget() {
  const chatHTML = `
    <div id="chatWidget" class="chat-widget">
      <div class="chat-header" id="chatHeader" onclick="toggleChat()">
        <div class="chat-header-info">
          <span class="chat-header-icon">🤖</span>
          <span class="chat-header-title">SanTime AI Assistant</span>
          <span class="ai-badge" style="font-size:10px;background:linear-gradient(135deg,#00E676,#00B0FF);color:#0A0E17;padding:2px 8px;border-radius:12px;font-weight:700;margin-left:6px;">Gemini AI</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="chat-settings-icon" onclick="setGeminiApiKey(event)" title="Cài đặt API Key" style="font-size: 1rem; cursor: pointer;">⚙️</span>
          <span class="chat-toggle-icon">▲</span>
        </div>
      </div>
      <div class="chat-body" id="chatBody">
        <div class="chat-messages" id="chatMessages">
          <div class="chat-message received">
            <div class="chat-message-avatar">🤖</div>
            <div class="chat-message-content">
              <div class="chat-message-sender">SanTime AI</div>
              <div class="chat-message-text">Xin chào! Mình là trợ lý AI của SanTime, được hỗ trợ bởi Google Gemini. Mình có thể giúp bạn tìm sân, ghép đội, giải đáp thắc mắc hoặc tư vấn về thể thao. Hãy hỏi bất cứ điều gì nhé! 🏸⚽🏀</div>
            </div>
          </div>
        </div>
        <div class="chat-input-area">
          <input type="text" id="chatInput" placeholder="Hỏi AI bất cứ điều gì..." onkeypress="handleChatKey(event)">
          <button id="chatSendBtn" class="btn btn-primary" onclick="sendChatMessage()">Gửi</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', chatHTML);
}

window.toggleChat = function() {
  const widget = document.getElementById('chatWidget');
  const toggleIcon = document.querySelector('.chat-toggle-icon');
  if (widget.classList.contains('open')) {
    widget.classList.remove('open');
    toggleIcon.textContent = '▲';
  } else {
    widget.classList.add('open');
    toggleIcon.textContent = '▼';
    document.getElementById('chatInput').focus();
    setTimeout(scrollToBottom, 100);
  }
};

window.setGeminiApiKey = function(event) {
  event.stopPropagation();
  const currentKey = localStorage.getItem('santime_gemini_api_key') || '';
  const newKey = prompt('Nhập Gemini API Key của bạn để sử dụng AI thông minh hơn. Nếu để trống, hệ thống sẽ tự động chuyển về Bot trả lời mẫu:', currentKey);
  if (newKey !== null) {
    localStorage.setItem('santime_gemini_api_key', newKey.trim());
    if (newKey.trim() !== '') {
      showToast('Đã lưu API Key thành công!', 'success');
    } else {
      showToast('Đã xóa API Key. Hệ thống sẽ sử dụng Bot mẫu.', 'info');
    }
  }
};

window.handleChatKey = function(e) {
  if (e.key === 'Enter') {
    sendChatMessage();
  }
};

window.sendChatMessage = async function() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  appendMessage('sent', 'Bạn', text);
  input.value = '';
  input.disabled = true;
  document.getElementById('chatSendBtn').disabled = true;

  // Show typing indicator
  const typingId = showTypingIndicator();

  try {
    const reply = await callGeminiAI(text);
    removeTypingIndicator(typingId);
    appendMessage('received', 'SanTime AI', reply);
  } catch (error) {
    removeTypingIndicator(typingId);
    console.error('AI Error:', error);
    // Fallback to smart local response
    const fallback = getLocalFallbackResponse(text);
    appendMessage('received', 'SanTime AI', fallback);
  }

  input.disabled = false;
  document.getElementById('chatSendBtn').disabled = false;
  input.focus();
};

// ---- Google AI Studio (Gemini) Integration ----
const GEMINI_MODEL = 'gemini-2.5-flash';

let chatHistory = [];

async function callGeminiAI(userMessage) {
  const apiKey = localStorage.getItem('santime_gemini_api_key');
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Missing API Key. Fallback to local response.');
  }
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  // Build context-aware system prompt
  const systemPrompt = `Bạn là SanTime AI Assistant — trợ lý thông minh của nền tảng SanTime, chuyên về đặt sân thể thao và ghép đội tại Việt Nam (tập trung Hà Nội).

Thông tin về SanTime:
- Nền tảng đặt sân cầu lông, bóng đá, bóng rổ, bóng chuyền, tennis
- Có 500+ sân thể thao, 10,000+ người chơi
- Tính năng chính: Ghép đội thông minh (AI KNN), Đặt sân real-time, Rating uy tín
- Thanh toán: VNPay, MoMo, Tiền mặt
- Khu vực: Hà Nội (Hai Bà Trưng, Đống Đa, Cầu Giấy, Thanh Xuân, Hoàng Mai...)
- Dự án của sinh viên ĐH Bách Khoa Hà Nội

Hướng dẫn:
- Trả lời bằng tiếng Việt, thân thiện, ngắn gọn (tối đa 3-4 câu)
- Dùng emoji phù hợp 🏸⚽🏀
- Tư vấn về thể thao, sức khỏe, kỹ thuật chơi
- Gợi ý tìm sân, ghép đội khi phù hợp
- Nếu hỏi về giá: sân cầu lông ~100-300k/h, bóng đá ~400-800k/h
- KHÔNG trả lời các câu hỏi nhạy cảm về chính trị, tôn giáo`;

  chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });

  // Keep only last 10 messages for context window
  const recentHistory = chatHistory.slice(-10);

  const requestBody = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: recentHistory,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 300
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
    ]
  };

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Gemini API error:', response.status, errorData);
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Xin lỗi, mình chưa thể trả lời câu hỏi này. Bạn thử hỏi lại nhé!';

  chatHistory.push({ role: 'model', parts: [{ text: aiReply }] });

  return aiReply;
}

function getLocalFallbackResponse(text) {
  const lower = text.toLowerCase();
  if (lower.includes('sân') || lower.includes('đặt')) {
    return '🏟️ Bạn có thể vào mục "Tìm sân" để xem danh sách sân trống, hoặc "Đặt sân" để chọn lịch nhé! Hiện có 500+ sân tại Hà Nội.';
  } else if (lower.includes('ghép') || lower.includes('đội') || lower.includes('đồng đội')) {
    return '🤝 Vào mục "Ghép đội", chọn môn thể thao và trình độ — hệ thống AI sẽ tìm đồng đội phù hợp trong vài giây!';
  } else if (lower.includes('giá') || lower.includes('bao nhiêu') || lower.includes('tiền')) {
    return '💰 Giá sân phổ biến: Cầu lông 100-300k/h, Bóng đá 400-800k/h. Xem chi tiết tại mục "Tìm sân" nhé!';
  } else if (lower.includes('cảm ơn') || lower.includes('thank')) {
    return '😊 Không có gì! Chúc bạn có trận đấu thật vui vẻ! Nếu cần hỗ trợ thêm, cứ hỏi mình nhé!';
  }
  return '🤖 Mình đang gặp chút trục trặc kết nối. Bạn có thể thử lại hoặc liên hệ hotline 0123.456.789 để được hỗ trợ nhanh nhất!';
}

function showTypingIndicator() {
  const messagesContainer = document.getElementById('chatMessages');
  const id = 'typing-' + Date.now();
  const html = `
    <div class="chat-message received" id="${id}">
      <div class="chat-message-avatar">🤖</div>
      <div class="chat-message-content">
        <div class="chat-message-sender">SanTime AI</div>
        <div class="chat-message-text typing-indicator">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    </div>
  `;
  messagesContainer.insertAdjacentHTML('beforeend', html);
  scrollToBottom();
  return id;
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function appendMessage(type, sender, text) {
  const messagesContainer = document.getElementById('chatMessages');
  const avatar = type === 'sent' ? '👤' : '🤖';
  // Convert markdown-like formatting to HTML
  const formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
  const html = `
    <div class="chat-message ${type}">
      <div class="chat-message-avatar">${avatar}</div>
      <div class="chat-message-content">
        <div class="chat-message-sender">${sender}</div>
        <div class="chat-message-text">${formattedText}</div>
      </div>
    </div>
  `;
  messagesContainer.insertAdjacentHTML('beforeend', html);
  scrollToBottom();
}

function scrollToBottom() {
  const messagesContainer = document.getElementById('chatMessages');
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ---- Role Selection ----
function initRoleSelection() {
  const overlay = document.getElementById('welcomeOverlay');
  if (!overlay) return; // Only exists on index.html
  
  const currentRole = localStorage.getItem('santime_role');
  if (currentRole) {
    overlay.classList.add('hidden');
  }
}

window.selectRole = function(role) {
  localStorage.setItem('santime_role', role);
  document.getElementById('welcomeOverlay').classList.add('hidden');
  
  // Reload page to update Navbar based on role
  setTimeout(() => {
    window.location.reload();
  }, 400);
};

// ---- System Admin Logic ----
function initAdminButton() {
  const adminHTML = `
    <div id="adminFloatingBtn" class="admin-floating-btn" onclick="promptAdminLogin()" title="Quản trị hệ thống">
      ⚙️
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', adminHTML);
}

window.promptAdminLogin = function() {
  const password = prompt('Vui lòng nhập mật khẩu Quản trị viên (123456789):');
  if (password === '123456789') {
    showToast('Đăng nhập thành công! Chuyển hướng...', 'success');
    
    // Determine path prefix (are we in pages/ or root?)
    const isRoot = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    const adminPath = isRoot ? 'pages/admin.html' : 'admin.html';
    
    setTimeout(() => {
      window.location.href = adminPath;
    }, 1000);
  } else if (password !== null) {
    showToast('Mật khẩu không chính xác!', 'error');
  }
};

// ==========================================
// VIETNAM SOVEREIGNTY MAP INITIALIZATION
// ==========================================
function initVietnamMap() {
  const mapContainer = document.getElementById('vietnamMap');
  if (!mapContainer || typeof L === 'undefined') return;

  // Center map on Vietnam (shows both mainland and islands)
  const map = L.map('vietnamMap', {
    center: [16.0, 108.0],
    zoom: 5.5,
    zoomControl: false,
    scrollWheelZoom: false,
    attributionControl: false
  });

  // Use Google Maps with explicit Vietnamese localization (hl=vi)
  // This absolutely guarantees that "Biển Đông" and all Vietnamese territories are correctly labeled
  L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi', {
    maxZoom: 19,
    attributionControl: false
  }).addTo(map);

  L.control.zoom({ position: 'topright' }).addTo(map);

  // 1. Hoàng Sa (Paracel Islands)
  const hoangSaIcon = L.divIcon({
    className: 'sovereignty-icon',
    html: '<div class="sovereignty-marker">★</div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
  
  L.marker([16.5, 112.0], { icon: hoangSaIcon }).addTo(map)
    .bindTooltip(`
      <div class="sovereignty-label">
        <span class="label-title">Quần đảo Hoàng Sa</span>
        <span class="label-sub">Đà Nẵng, Việt Nam</span>
      </div>
    `, {
      permanent: true,
      direction: 'right',
      className: 'sovereignty-tooltip',
      offset: [15, 0]
    });

  // 2. Trường Sa (Spratly Islands)
  const truongSaIcon = L.divIcon({
    className: 'sovereignty-icon',
    html: '<div class="sovereignty-marker">★</div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
  
  L.marker([9.0, 113.0], { icon: truongSaIcon }).addTo(map)
    .bindTooltip(`
      <div class="sovereignty-label">
        <span class="label-title">Quần đảo Trường Sa</span>
        <span class="label-sub">Khánh Hòa, Việt Nam</span>
      </div>
    `, {
      permanent: true,
      direction: 'right',
      className: 'sovereignty-tooltip',
      offset: [15, 0]
    });

  // 3. Biển Đông Label
  const bienDongIcon = L.divIcon({
    className: 'bien-dong-icon',
    html: `
      <div class="bien-dong-label">
        <span class="bd-title">BIỂN ĐÔNG</span>
        <span class="bd-sub">(EAST SEA)</span>
        <span class="bd-sovereignty">CHỦ QUYỀN VIỆT NAM</span>
      </div>
    `,
    iconSize: [200, 100],
    iconAnchor: [100, 50]
  });
  L.marker([14.5, 114.5], { icon: bienDongIcon, interactive: false }).addTo(map);

  // 4. SanTime Active Cities
  const cities = [
    { name: "Hà Nội", coords: [21.0285, 105.8542], courts: 320 },
    { name: "TP. Hồ Chí Minh", coords: [10.8231, 106.6297], courts: 450 },
    { name: "Đà Nẵng", coords: [16.0471, 108.2062], courts: 85 },
    { name: "Hải Phòng", coords: [20.8449, 106.6881], courts: 42 },
    { name: "Cần Thơ", coords: [10.0452, 105.7469], courts: 36 }
  ];

  cities.forEach(city => {
    const cityIcon = L.divIcon({
      className: 'city-icon',
      html: '<div class="city-marker"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
    
    L.marker(city.coords, { icon: cityIcon }).addTo(map)
      .bindTooltip(`${city.name}<br><span style="font-size:11px;color:var(--primary);font-weight:400;">${city.courts} sân</span>`, {
        direction: 'top',
        className: 'vietnam-map-tooltip',
        offset: [0, -10]
      });
  });
}

// Ensure map is initialized if container exists
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('vietnamMap')) {
    // Small delay to ensure CSS is loaded
    setTimeout(initVietnamMap, 100);
  }
});
