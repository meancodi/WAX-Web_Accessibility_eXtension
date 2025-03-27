chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Request received in background script");

  if (!message.activeTab) {
    console.error("No tab ID received");
    sendResponse({ error: "No tab ID received" });
    return true;
  }

  console.log("ActiveTab:", message.activeTab);
  console.log("ActiveTab.id:", message.activeTab.id);
  console.log("ActiveTab.url:", message.activeTab.url);

  // Use the tab ID received from popup
  chrome.tabs.sendMessage(message.activeTab.id, {action:"fetchData"}, response => {
    if (chrome.runtime.lastError) {
      console.error("Error:", chrome.runtime.lastError);
      sendResponse({ error: chrome.runtime.lastError.message });
      return;
    }
    sendResponse(response);
  });

  return true; // Keeps the sendResponse channel open
});