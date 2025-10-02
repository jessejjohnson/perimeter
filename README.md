# Perimeter: Anti-Bot Detector

A Chrome extension that detects and tracks anti-bot services on websites you visit.

## Features

- **Real-time Detection**: Automatically identifies anti-bot services on each page
- **Visual Indicators**: Badge shows detection status
  - Green checkmark (✓) when no services detected
  - Red badge with count when services are found
- **Service History**: Tracks all anti-bot services encountered per domain
- **14+ Service Detection**: Identifies major anti-bot solutions including:
  - Cloudflare
  - reCAPTCHA
  - hCaptcha
  - DataDome
  - PerimeterX
  - Akamai
  - Imperva/Incapsula
  - Kasada
  - Shape Security
  - Arkose Labs
  - Distil Networks
  - Reblaze
  - Radware
  - FingerprintJS

## Installation

### From Source

1. Clone this repository
```bash
git clone https://github.com/jessejjohnson/perimeter.git
cd perimeter
```

2. Generate icon files
   - Convert `icons/logo.svg` to PNG at 16x16, 48x48, and 128x128 pixels
   - Save as `icon16.png`, `icon48.png`, and `icon128.png` in the `icons/` directory

3. Load the extension in Chrome
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the extension directory

## Usage

Once installed, the extension works automatically:

1. **Current Page View**: Click the extension icon to see services detected on the current page
2. **History View**: Switch to the History tab to see all domains and their associated anti-bot services
3. **Badge Indicator**: Check the extension icon badge for quick status
   - Green = Clean
   - Red number = Services detected

## Project Structure

```
perimeter/
├── manifest.json           # Extension configuration
├── icons/                  # Extension icons
│   ├── logo.svg           # Source logo (flat, no background)
│   ├── icon16.png         # 16x16 icon
│   ├── icon48.png         # 48x48 icon
│   └── icon128.png        # 128x128 icon
├── src/
│   ├── background/
│   │   └── background.js  # Service worker for state management
│   ├── content/
│   │   └── content.js     # Content script for detection
│   └── popup/
│       ├── popup.html     # Extension popup interface
│       ├── popup.css      # Popup styles
│       └── popup.js       # Popup logic
├── README.md
└── .gitignore
```

## How It Works

1. **Content Script**: Runs on every page and scans for anti-bot service signatures
2. **Detection Methods**:
   - Script source URLs
   - Cookie patterns
   - DOM elements and attributes
   - Global JavaScript variables
   - Dynamic content monitoring
3. **Background Service**: Manages detection data, badge updates, and history storage
4. **Popup Interface**: Displays current detections and historical data

## Privacy

This extension:
- Only stores domain names and detected service names locally
- Does not collect or transmit any personal data
- Does not track browsing history beyond anti-bot detections
- All data stays on your device

## Contributing

Contributions are welcome. To add detection for a new anti-bot service:

1. Fork the repository
2. Add detection logic to `src/content/content.js`
3. Test thoroughly across multiple sites
4. Submit a pull request with details

## License

GNU GPLv3 - See LICENSE file for details

## Disclaimer

This tool is for educational and research purposes. Use responsibly and in accordance with website terms of service.