console.log("Content script loaded"); // Debug log

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content script:", message);

  if (message.action === "fetchData") {
    if (typeof axe === "undefined") {
      const script = document.createElement("script");
      script.src = chrome.runtime.getURL("node_modules/axe-core/axe.min.js");
      script.onload = () => {
        console.log("axe-core loaded");
        runAxeTest(sendResponse);
      };
      document.head.appendChild(script);
    } else {
      runAxeTest(sendResponse);
    }
    return true; // Required for async response
  }
});

function runAxeTest(sendResponse) {
  axe.run(document, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag2aaa"]
    }
  }).then(results => {
    sendResponse({ results });
  }).catch(err => {
    sendResponse({ error: err.message });
  });
}