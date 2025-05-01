# WAX - Web Accessibility eXtension

A Chrome extension that performs comprehensive accessibility audits using axe-core and provides AI-powered fix suggestions using Google's Gemini API.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)

## 🌟 Features

- **One-Click Accessibility Audit**: Run comprehensive accessibility checks on any webpage with a single click
- **WCAG Compliance**: Tests against WCAG 2.0, 2.1, and 2.2 standards (A, AA, and AAA levels)
- **Detailed Reports**: Provides comprehensive reports for accessibility issues with detailed explanations
- **AI-Powered Fixes**: Uses Google's Gemini API to suggest code fixes for detected accessibility violations
- **Visual Highlighting**: Highlights problematic elements directly in the console with detailed information
- **Developer Guidance**: Provides contextual guidance for manual fixes when automated suggestions aren't available

## 📋 Requirements

- Google Chrome browser (version 88 or higher)
- A Google API key for the Gemini API (for AI-powered fix suggestions)

## 🔧 Installation

### From Chrome Web Store
*(Coming soon)*

### Manual Installation
1. Clone this repository or download it as a ZIP file
   ```
   git clone https://github.com/yourusername/web-accessibility-checker.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the directory containing the extension files
5. Add your Gemini API key to `config.js`

## 🚀 Usage

1. Navigate to any webpage you want to check
2. Click on the extension icon in your Chrome toolbar
3. Choose an option:
   - **Run Accessibility Check**: Scans the page and provides a report with AI-powered fix suggestions
   - **Get WCAG Report Only**: Scans the page and provides a detailed report without fix suggestions

## 📊 Understanding the Results

The extension organizes results into several categories:

### WCAG Passes
Elements that pass WCAG accessibility checks, organized by WCAG rule number and level (A, AA, AAA).

### WCAG Violations
Accessibility issues that need to be fixed, sorted by severity. For each violation, you'll see:
- Description of the issue
- WCAG rule reference and level
- HTML element causing the problem
- AI-suggested fix (when available)
- Developer guidance

### Manual Checks Required
Items that require human judgment to determine if they meet accessibility standards.

### Non-WCAG Items
Additional best practices that don't directly map to WCAG criteria but are still important for accessibility.

## ⚙️ Configuration

Edit the `config.js` file to add your Google Gemini API key:

```javascript
const CONFIG = {
    API_KEY: "YOUR_GEMINI_API_KEY", 
    API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
};
```

## 🛠️ Technical Details

This extension uses:
- **axe-core**: The leading accessibility testing library for websites
- **Google Gemini API**: For generating accessibility fix suggestions
- **Chrome Extensions API**: For browser integration and DOM manipulation

The extension injects scripts into the current page to analyze the DOM and report accessibility issues using the axe-core library. When AI fixes are requested, it processes the violations and sends them to the Gemini API for analysis and fix suggestions.

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Run any tests/linters
5. Commit your changes (`git commit -m 'Add new feature'`)
6. Push to the branch (`git push origin feature-branch`)
7. Open a Pull Request

## 📚 Documentation

For more details on the WCAG rules being tested, refer to the `WAX-ruleset-documentation.md` file included in this repository.

## ⚠️ Privacy Notice

This extension:
- Does not collect or store any user data
- Only sends the HTML of accessibility violations to Google's Gemini API when the "Run Accessibility Check" option is used
- Does not track user behavior or browsing history
- Works entirely client-side except for API calls to Google Gemini

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Deque Labs](https://github.com/dequelabs) for the axe-core library
- Google for the Gemini API
- All contributors who have helped improve this extension
