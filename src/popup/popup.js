// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    // Update tab UI
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    tab.classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    // Load history when switching to history tab
    if (tabName === 'history') {
      loadHistory();
    }
  });
});

// Load current page data
chrome.runtime.sendMessage({ action: 'getCurrentTabData' }, (data) => {
  const { services, url, domain } = data;
  
  // Update URL display
  document.getElementById('currentUrl').textContent = domain || 'No page loaded';
  
  // Display services
  const serviceList = document.getElementById('serviceList');
  
  if (services && services.length > 0) {
    serviceList.innerHTML = services
      .map(service => `<div class="service-item">${service}</div>`)
      .join('');
  } else {
    serviceList.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div>No anti-bot services detected</div>
      </div>
    `;
  }
});

// Load history
function loadHistory() {
  chrome.runtime.sendMessage({ action: 'getHistory' }, (historyMap) => {
    const historyList = document.getElementById('historyList');
    const stats = document.getElementById('stats');
    
    if (!historyMap || Object.keys(historyMap).length === 0) {
      historyList.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>No history yet</div>
        </div>
      `;
      stats.innerHTML = '';
      return;
    }
    
    // Convert map to array and sort by last seen
    const historyArray = Object.values(historyMap).sort((a, b) => b.lastSeen - a.lastSeen);
    
    // Calculate stats
    const uniqueDomains = historyArray.length;
    const allServices = new Set();
    historyArray.forEach(entry => entry.services.forEach(s => allServices.add(s)));
    
    stats.innerHTML = `
      <div class="stat-box">
        <div class="stat-value">${uniqueDomains}</div>
        <div class="stat-label">Domains Tracked</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${allServices.size}</div>
        <div class="stat-label">Unique Services</div>
      </div>
    `;
    
    // Display history
    historyList.innerHTML = historyArray
      .map(entry => {
        const lastSeen = new Date(entry.lastSeen);
        const firstSeen = new Date(entry.firstSeen);
        const timeStr = lastSeen.toLocaleString();
        
        return `
          <div class="history-item">
            <div class="history-domain">${entry.domain}</div>
            <div class="history-services">${entry.services.join(', ')}</div>
            <div class="history-time">Last seen: ${timeStr}</div>
          </div>
        `;
      })
      .join('');
  });
}

// Clear history
document.getElementById('clearHistory').addEventListener('click', () => {
  if (confirm('Clear all history?')) {
    chrome.runtime.sendMessage({ action: 'clearHistory' }, () => {
      loadHistory();
    });
  }
});