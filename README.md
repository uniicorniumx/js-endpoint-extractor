# 🕵️‍♀️ JS Endpoint Extractor & Vulnerability Matcher (Chrome Extension)

A Chrome extension that extracts JavaScript endpoints, flags risky code patterns, detects JS libraries in use, probes endpoint reachability, and exports detailed JSON reports.

## ⚙ Features

- 🔍 **Extracts endpoints** from all loaded JavaScript files (external & inline)
- 🚨 **Flags vulnerable patterns** (e.g., `eval()`, `innerHTML`, `document.write`)
- 🔬 **Detects known JS libraries** (React, jQuery, Vue, Angular)
- 🌐 **Checks endpoint reachability**
- 📤 **Exports full report** as JSON with severity scores

## 📸 Screenshot

> _Coming soon._

## 🚀 Installation

1. Clone the repo or download it as a ZIP:

git clone https://github.com/uniicorniumx/js-endpoint-extractor.git

## 🧪 How to Use
   Visit any webpage.
   Click the JS Endpoint Extractor icon.
   View:
     Detected endpoints
     Vulnerable patterns (highlighted)
     Libraries in use
     Reachability status of each endpoint
  Click “Export JSON Report” to download analysis.
    
## 📂 Project Structure
manifest.json – Chrome extension config
  content.js – Grabs script code from the page
  popup.js – Runs static analysis, probing, reporting
  popup.html – Extension UI
  background.js – (placeholder for future enhancements)

## 🛡️ Risky Patterns Detected
eval(), innerHTML, document.write()
  setTimeout() with string eval
  fetch(), XMLHttpRequest, .open()
  Accessing document.cookie or location.href
    
## 🔍 Library Detection
Identifies if the page is using:
  React
  jQuery
  Vue.js
  Angular

## 📥 Export Report
Outputs a JSON report with:
  Source file
  Vulnerabilities detected
  Libraries detected
  Endpoints & reachability
  Severity score

## 🔧 Future Improvements
  Version fingerprinting (e.g., jQuery 1.6.3)
  Real-time alerts in popup
  Export HTML report
