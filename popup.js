function detectLibraries(code) {
  const libs = [];
  if (/React\.version/.test(code)) libs.push('React');
  if (/jQuery|\$\(/.test(code)) libs.push('jQuery');
  if (/Vue/.test(code)) libs.push('Vue.js');
  if (/Angular/.test(code)) libs.push('Angular');
  return libs;
}

function extractEndpoints(code) {
  const endpoints = [];
  const regex = /['"]((https?:)?\/\/[^'"\s]+)['"]/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    endpoints.push(match[1]);
  }
  return [...new Set(endpoints)];
}

async function checkReachability(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    return res.status ? `${res.status}` : 'reachable';
  } catch (e) {
    return 'unreachable';
  }
}

chrome.storage.local.get('payload', async ({ payload }) => {
  const output = document.getElementById('output');
  output.innerHTML = '';

  const riskyPatterns = [
    { pattern: /fetch\(/gi, label: 'fetch' },
    { pattern: /XMLHttpRequest/gi, label: 'XMLHttpRequest' },
    { pattern: /\.open\(/gi, label: 'open' },
    { pattern: /\.write\(/gi, label: 'document.write' },
    { pattern: /innerHTML/gi, label: 'innerHTML' },
    { pattern: /eval\(/gi, label: 'eval' },
    { pattern: /setTimeout\((\s*)['\"](.*)['\"]/gi, label: 'setTimeout string eval' },
    { pattern: /location\.href/gi, label: 'location.href' },
    { pattern: /document\.cookie/gi, label: 'document.cookie' }
  ];

  const report = [];

  for (const entry of payload) {
    const container = document.createElement('div');
    const lines = entry.code.split('\n');
    let flagged = false;
    const matchedPatterns = new Set();
    const libMatches = detectLibraries(entry.code);
    const endpoints = extractEndpoints(entry.code);
    const reachabilityMap = {};

    for (const url of endpoints) {
      reachabilityMap[url] = await checkReachability(url);
    }

    const resultLines = lines.map((line, idx) => {
      let flaggedLine = line;
      for (const { pattern, label } of riskyPatterns) {
        if (pattern.test(line)) {
          flagged = true;
          matchedPatterns.add(label);
          flaggedLine = `<span class='vuln'>[${idx + 1}] ${line}</span>`;
          break;
        }
      }
      return flaggedLine;
    });

    container.innerHTML = `<h4>${entry.source}</h4>` +
      (libMatches.length > 0 ? `<p class='library'>Libraries: ${libMatches.join(', ')}</p>` : '') +
      (endpoints.length > 0 ? `<p>Endpoints: <ul>${endpoints.map(e => `<li>${e} - ${reachabilityMap[e]}</li>`).join('')}</ul></p>` : '') +
      `<pre>${resultLines.join('\n')}</pre>`;
    output.appendChild(container);

    report.push({
      source: entry.source,
      vulnerable: flagged,
      riskyPatterns: Array.from(matchedPatterns),
      libraries: libMatches,
      endpoints: endpoints.map(e => ({ url: e, status: reachabilityMap[e] })),
      severityScore: matchedPatterns.size * 10
    });
  }

  document.getElementById('exportBtn').onclick = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'js_extractor_report.json';
    a.click();
  };
});