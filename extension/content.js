// PhishCure Proactive Interceptor - Content Script

// --- 1. Smart Pre-Filtering (Local Heuristics) ---
const suspiciousTLDs = ['.xyz', '.top', '.online', '.club', '.win', '.click'];
const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;
const urlShorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly'];

function isSuspiciousLocally(link) {
  try {
    const href = link.href;
    if (!href || href.startsWith('javascript:') || href.startsWith('mailto:')) return false;

    const urlObj = new URL(href);
    const hostname = urlObj.hostname.toLowerCase();
    const text = link.innerText.trim().toLowerCase();

    // Heuristic 1: Link text looks like a domain, but href is completely different
    // e.g. text="paypal.com", href="http://evil.com"
    if (text.includes('.') && !text.match(/\s/) && text.length > 5) {
      // If the text looks like a URL/Domain, extract its hostname-like part
      const textDomain = text.replace(/^https?:\/\//, '').split('/')[0].replace('www.', '');
      // Check if the entire href contains the text domain (this allows safe tracking links like google.com/url?q=wikipedia.org)
      if (!href.includes(textDomain) && !textDomain.includes(hostname.replace('www.', ''))) {
        return true;
      }
    }

    // Heuristic 2: Suspicious TLD
    if (suspiciousTLDs.some(tld => hostname.endsWith(tld))) return true;

    // Heuristic 3: IP Address instead of Domain
    if (ipRegex.test(hostname)) return true;

    // Heuristic 4: URL Shorteners
    if (urlShorteners.some(sh => hostname.includes(sh))) return true;

    return false;
  } catch (e) {
    return false; // Malformed URL
  }
}

function scanDOMForLinks() {
  const links = document.querySelectorAll('a:not(.phishcure-scanned)');
  links.forEach(link => {
    link.classList.add('phishcure-scanned'); // mark as processed
    if (isSuspiciousLocally(link)) {
      link.classList.add('phishcure-suspicious-link');
      link.title = "PhishCure Alert: This link looks suspicious. Click with caution.";
    }
  });
}

// Run initial scan
setTimeout(scanDOMForLinks, 1000);

// Use MutationObserver to catch dynamically loaded links (e.g., in Gmail or Twitter)
const observer = new MutationObserver((mutations) => {
  let shouldScan = false;
  for (let m of mutations) {
    if (m.addedNodes.length > 0) {
      shouldScan = true;
      break;
    }
  }
  if (shouldScan) {
    scanDOMForLinks();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// --- 2. Click Interceptor (Navigation Halting) ---

let activeInterceptModal = null;

function createModal() {
  if (activeInterceptModal) activeInterceptModal.remove();

  const overlay = document.createElement('div');
  overlay.id = 'phishcure-intercept-overlay';
  
  overlay.innerHTML = `
    <div class="phishcure-modal" id="phishcure-modal-box">
      <div class="phishcure-spinner" id="phishcure-spinner"></div>
      <div id="phishcure-icon" style="font-size: 3rem; margin-bottom: 1rem; display: none;"></div>
      <h2 class="phishcure-title" id="phishcure-title">Intercepting Navigation...</h2>
      <p class="phishcure-text" id="phishcure-desc">PhishCure AI is deep-scanning this destination for threats.<br/><span style="font-size:0.85rem; opacity:0.7;">(This live security analysis may take 3-5 seconds)</span></p>
      <div class="phishcure-url-box" id="phishcure-target-url"></div>
      <div class="phishcure-reasoning" id="phishcure-reasoning" style="display: none;"></div>
      
      <div class="phishcure-btn-group" id="phishcure-actions" style="display: none;">
        <button class="phishcure-btn phishcure-btn-outline" id="phishcure-btn-cancel">Close & Abort</button>
        <button class="phishcure-btn" id="phishcure-btn-proceed">Proceed Anyway</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

document.addEventListener('click', async (e) => {
  // Find closest anchor tag
  const link = e.target.closest('a');
  if (!link || !link.href) return;

  // We only aggressively intercept links that were flagged locally as suspicious
  // Or if the user explicitly held the 'Alt' or 'Shift' key while clicking (manual scan mode)
  if (link.classList.contains('phishcure-suspicious-link') || e.altKey || e.shiftKey) {
    e.preventDefault();
    e.stopPropagation();

    const targetUrl = link.href;

    // Show Intercept Modal
    const modal = createModal();
    activeInterceptModal = modal;
    
    document.getElementById('phishcure-target-url').innerText = targetUrl.length > 50 ? targetUrl.substring(0, 50) + '...' : targetUrl;

    // Call Backend
    chrome.runtime.sendMessage({ action: 'analyze_url', url: targetUrl }, (response) => {
      const modalBox = document.getElementById('phishcure-modal-box');
      const spinner = document.getElementById('phishcure-spinner');
      const icon = document.getElementById('phishcure-icon');
      const title = document.getElementById('phishcure-title');
      const desc = document.getElementById('phishcure-desc');
      const reasoning = document.getElementById('phishcure-reasoning');
      const actions = document.getElementById('phishcure-actions');
      const btnProceed = document.getElementById('phishcure-btn-proceed');
      const btnCancel = document.getElementById('phishcure-btn-cancel');

      spinner.style.display = 'none';
      icon.style.display = 'block';

      if (chrome.runtime.lastError || !response || !response.success) {
        // Error handling: Background worker died, timed out, or fetch failed
        icon.innerText = '⚠️';
        title.innerText = 'Scan Failed / Timeout';
        desc.innerText = 'The AI Backend might be asleep or unreachable. ' + (chrome.runtime.lastError ? chrome.runtime.lastError.message : '');
        actions.style.display = 'flex';
        btnProceed.className = 'phishcure-btn phishcure-btn-primary';
      } else {
        const { score, verdict, summary } = response.data;
        
        if (score >= 60) {
          // Safe - auto proceed after a short delay
          modalBox.className = 'phishcure-modal safe';
          icon.innerText = '✅';
          title.innerText = 'Target Verified Safe';
          title.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
          title.style.webkitBackgroundClip = 'text';
          desc.innerText = 'Routing you securely to your destination...';
          
          setTimeout(() => {
            modal.remove();
            activeInterceptModal = null;
            window.location.href = targetUrl;
          }, 1500);

        } else if (score === 50 && summary.includes('failed')) {
          // AI Connection / Rate Limit Error
          modalBox.className = 'phishcure-modal';
          icon.innerText = '⚠️';
          title.innerText = 'AI Analysis Unavailable';
          title.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
          title.style.webkitBackgroundClip = 'text';
          desc.innerText = 'The PhishCure AI backend is currently rate-limited or unreachable.';
          
          reasoning.innerText = summary;
          reasoning.style.display = 'block';
          
          actions.style.display = 'flex';
          btnProceed.className = 'phishcure-btn phishcure-btn-primary';
          btnProceed.innerText = 'Proceed Unverified';
          btnCancel.className = 'phishcure-btn phishcure-btn-outline';
          btnCancel.innerText = 'Go Back';
        } else {
          // Danger - BLOCK
          modalBox.className = 'phishcure-modal danger';
          icon.innerText = '🛑';
          title.innerText = 'Navigation Blocked';
          title.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
          title.style.webkitBackgroundClip = 'text';
          desc.innerText = 'PhishCure AI has intercepted a high-risk connection.';
          
          reasoning.innerText = summary || 'This domain exhibits multiple characteristics of a phishing attack.';
          reasoning.style.display = 'block';
          
          actions.style.display = 'flex';
          btnProceed.className = 'phishcure-btn phishcure-btn-outline';
          btnProceed.innerText = 'Ignore Risk & Proceed';
          btnCancel.className = 'phishcure-btn phishcure-btn-danger';
          btnCancel.innerText = 'Stay Safe (Close)';
        }
      }

      // Action Handlers
      if (btnProceed) {
        btnProceed.onclick = () => {
          modal.remove();
          activeInterceptModal = null;
          window.location.href = targetUrl;
        };
      }
      
      if (btnCancel) {
        btnCancel.onclick = () => {
          modal.remove();
          activeInterceptModal = null;
        };
      }
    });
  }
}, true); // useCapture to intercept before other handlers
