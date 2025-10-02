// Store current tab data
const tabData = {};

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'servicesDetected') {
    const tabId = sender.tab.id;
    const { services, url, domain, timestamp } = message.data;
    
    // Store current tab data
    tabData[tabId] = { services, url, domain, timestamp };
    
    // Update badge
    updateBadge(tabId, services.length);
    
    // Save to history
    saveToHistory(services, url, domain, timestamp);
  }
});

// Update badge with service count
function updateBadge(tabId, count) {
  if (count > 0) {
    // Red badge with count when services detected
    chrome.action.setBadgeText({
      text: count.toString(),
      tabId: tabId
    });
    chrome.action.setBadgeBackgroundColor({
      color: '#FF6B6B',
      tabId: tabId
    });
  } else {
    // Green badge when no services detected
    chrome.action.setBadgeText({
      text: '✓',
      tabId: tabId
    });
    chrome.action.setBadgeBackgroundColor({
      color: '#4CAF50',
      tabId: tabId
    });
  }
}

// Save detection to history (one entry per domain with collective services)
async function saveToHistory(services, url, domain, timestamp) {
  if (services.length === 0) return;
  
  const result = await chrome.storage.local.get('history');
  const historyMap = result.history || {};
  
  // Check if domain already exists
  if (historyMap[domain]) {
    // Merge services (unique set)
    const existingServices = new Set(historyMap[domain].services);
    services.forEach(service => existingServices.add(service));
    
    // Update entry
    historyMap[domain] = {
      services: Array.from(existingServices).sort(),
      domain,
      firstSeen: historyMap[domain].firstSeen,
      lastSeen: timestamp,
      urls: historyMap[domain].urls.includes(url) 
        ? historyMap[domain].urls 
        : [...historyMap[domain].urls, url].slice(-10) // Keep last 10 URLs
    };
  } else {
    // Create new entry
    historyMap[domain] = {
      services: services.sort(),
      domain,
      firstSeen: timestamp,
      lastSeen: timestamp,
      urls: [url]
    };
  }
  
  await chrome.storage.local.set({ history: historyMap });
}

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabData[tabId];
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    // Reset badge when page starts loading
    chrome.action.setBadgeText({
      text: '',
      tabId: tabId
    });
    delete tabData[tabId];
  }
});

// Export tab data for popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getCurrentTabData') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      sendResponse(tabData[tabId] || { services: [], url: '', domain: '' });
    });
    return true; // Async response
  }
  
  if (message.action === 'getHistory') {
    chrome.storage.local.get('history', (result) => {
      sendResponse(result.history || {});
    });
    return true; // Async response
  }
  
  if (message.action === 'clearHistory') {
    chrome.storage.local.set({ history: {} }, () => {
      sendResponse({ success: true });
    });
    return true; // Async response
  }
});