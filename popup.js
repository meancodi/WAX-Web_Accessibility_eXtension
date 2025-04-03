document.getElementById("callApi").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // tabs array contains the active tab
        console.log("Tabs:", tabs); 
        const tabId = tabs[0].id;
        console.log("Active tab ID:", tabId); // Log the active tab ID
        // chrome.scripting.executeScript({
        //     target: { tabId: tabId, allFrames: true }, // Add tabId here
        //     files: ["axe.min.js", "content.js"]
        // });
        chrome.scripting.executeScript(
            {
                target: { tabId: tabId, allFrames: true },
                files: ["axe.min.js", "content.js"]
            },
            (results) => {
                if (chrome.runtime.lastError) {
                    console.error("Script injection failed:", chrome.runtime.lastError.message);
                } else {
                    console.log("Scripts injected successfully:", results);
                }
            }
        );
        console.log("Script injected into tab ID:", tabId); // Log the script injection
    });
});