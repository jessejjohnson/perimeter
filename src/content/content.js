// Anti-bot service detection patterns
const detectors = {
  cloudflare: {
    check: () => {
      return !!(
        document.cookie.includes('__cflb') ||
        document.cookie.includes('__cfduid') ||
        document.cookie.includes('cf_clearance') ||
        document.querySelector('script[src*="cloudflare"]') ||
        document.querySelector('script[src*="challenges.cloudflare.com"]') ||
        window.Cloudflare ||
        document.querySelector('[data-ray]')
      );
    }
  },
  recaptcha: {
    check: () => {
      return !!(
        document.querySelector('script[src*="recaptcha"]') ||
        document.querySelector('.g-recaptcha') ||
        document.querySelector('[data-sitekey]') ||
        window.grecaptcha ||
        document.querySelector('iframe[src*="recaptcha"]')
      );
    }
  },
  hcaptcha: {
    check: () => {
      return !!(
        document.querySelector('script[src*="hcaptcha"]') ||
        document.querySelector('.h-captcha') ||
        window.hcaptcha ||
        document.querySelector('iframe[src*="hcaptcha"]')
      );
    }
  },
  datadome: {
    check: () => {
      return !!(
        document.cookie.includes('datadome') ||
        document.querySelector('script[src*="datadome"]') ||
        window.DD_RUM ||
        document.querySelector('[data-ddmark]')
      );
    }
  },
  perimeterx: {
    check: () => {
      return !!(
        document.cookie.includes('_px') ||
        document.querySelector('script[src*="perimeterx"]') ||
        document.querySelector('script[src*="pxchk"]') ||
        window._pxAppId ||
        document.querySelector('[data-pxhd]')
      );
    }
  },
  akamai: {
    check: () => {
      return !!(
        document.querySelector('script[src*="akamai"]') ||
        document.querySelector('script[src*="akam.net"]') ||
        window._satellite?.environment?.id ||
        document.cookie.includes('ak_bmsc')
      );
    }
  },
  imperva: {
    check: () => {
      return !!(
        document.querySelector('script[src*="imperva"]') ||
        document.querySelector('script[src*="incapsula"]') ||
        document.cookie.includes('incap_ses') ||
        document.cookie.includes('visid_incap')
      );
    }
  },
  kasada: {
    check: () => {
      return !!(
        document.querySelector('script[src*="kasada"]') ||
        document.querySelector('script[src*="kpsdk"]') ||
        window.KPSDK
      );
    }
  },
  shape: {
    check: () => {
      return !!(
        document.querySelector('script[src*="shapesecurity"]') ||
        document.querySelector('script[src*="shape-dist"]') ||
        window.botGuard
      );
    }
  },
  arkose: {
    check: () => {
      return !!(
        document.querySelector('script[src*="arkose"]') ||
        document.querySelector('script[src*="funcaptcha"]') ||
        window.setupEnforcement ||
        document.querySelector('iframe[src*="arkoselabs"]')
      );
    }
  },
  distilnetworks: {
    check: () => {
      return !!(
        document.querySelector('script[src*="distil"]') ||
        document.cookie.includes('distil_')
      );
    }
  },
  reblaze: {
    check: () => {
      return !!(
        document.querySelector('script[src*="reblaze"]') ||
        document.cookie.includes('reblaze')
      );
    }
  },
  radware: {
    check: () => {
      return !!(
        document.querySelector('script[src*="radware"]') ||
        document.cookie.includes('rdwr_')
      );
    }
  },
  fingerprintjs: {
    check: () => {
      return !!(
        document.querySelector('script[src*="fingerprintjs"]') ||
        document.querySelector('script[src*="fpjs"]') ||
        window.FingerprintJS
      );
    }
  }
};

// Perform detection
function detectServices() {
  const detected = [];
  
  for (const [name, detector] of Object.entries(detectors)) {
    try {
      if (detector.check()) {
        detected.push(name);
      }
    } catch (e) {
      console.error(`Error detecting ${name}:`, e);
    }
  }
  
  return detected;
}

// Run detection after page loads
function runDetection() {
  const services = detectServices();
  const url = window.location.href;
  const domain = window.location.hostname;
  
  // Send results to background script
  chrome.runtime.sendMessage({
    action: 'servicesDetected',
    data: {
      services,
      url,
      domain,
      timestamp: Date.now()
    }
  });
}

// Run detection
runDetection();

// Re-run detection when DOM changes (for dynamically loaded content)
let debounceTimer;
const observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runDetection, 1000);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});