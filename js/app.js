// ============================================
// SANTIME – Shared App Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initMobileMenu();
  initCounterAnimations();
  initChatWidget();
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
        <a href="${basePath}pages/dashboard.html">Dashboard</a>
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
          <span class="chat-header-icon">💬</span>
          <span class="chat-header-title">Hỗ trợ & Cộng đồng</span>
        </div>
        <span class="chat-toggle-icon">▲</span>
      </div>
      <div class="chat-body" id="chatBody">
        <div class="chat-messages" id="chatMessages">
          <div class="chat-message received">
            <div class="chat-message-avatar">⚡</div>
            <div class="chat-message-content">
              <div class="chat-message-sender">SanTime Bot</div>
              <div class="chat-message-text">Chào bạn! Mình có thể giúp gì cho bạn hôm nay? Bạn có thể tìm sân, ghép đội, hoặc hỏi bất kỳ thông tin nào ở đây nhé.</div>
            </div>
          </div>
        </div>
        <div class="chat-input-area">
          <input type="text" id="chatInput" placeholder="Nhập tin nhắn..." onkeypress="handleChatKey(event)">
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

window.handleChatKey = function(e) {
  if (e.key === 'Enter') {
    sendChatMessage();
  }
};

window.sendChatMessage = function() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  appendMessage('sent', 'Bạn', text);
  input.value = '';

  // Simulate bot response
  setTimeout(() => {
    let reply = 'Cảm ơn bạn đã liên hệ! Hiện tại bot đang trong quá trình thử nghiệm. Vui lòng thử lại sau nhé.';
    if (text.toLowerCase().includes('sân') || text.toLowerCase().includes('đặt')) {
      reply = 'Bạn có thể vào mục "Tìm sân" để xem danh sách các sân trống, hoặc vào "Đặt sân" để chọn lịch nhé!';
    } else if (text.toLowerCase().includes('ghép') || text.toLowerCase().includes('đội')) {
      reply = 'Hãy vào mục "Ghép đội", chọn môn thể thao và trình độ, hệ thống sẽ tự động tìm đồng đội phù hợp cho bạn trong vài giây!';
    }
    appendMessage('received', 'SanTime Bot', reply);
  }, 1000);
};

function appendMessage(type, sender, text) {
  const messagesContainer = document.getElementById('chatMessages');
  const avatar = type === 'sent' ? '👤' : '⚡';
  const html = `
    <div class="chat-message ${type}">
      <div class="chat-message-avatar">${avatar}</div>
      <div class="chat-message-content">
        <div class="chat-message-sender">${sender}</div>
        <div class="chat-message-text">${text}</div>
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
