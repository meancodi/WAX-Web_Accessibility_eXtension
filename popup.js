document.getElementById("callApi").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        document.getElementById("callApi").disabled = true;
        document.getElementById("status").innerText = "Checking.....";
        console.log("Tabs:", tabs); 
        const tabId = tabs[0].id;
        console.log("Active tab ID:", tabId); 
        chrome.scripting.executeScript(
            {
                target: { tabId: tabId, allFrames: false },
                files: ["axe.min.js", "content.js"]
            },
            (results) => {
                if (chrome.runtime.lastError) {
                    console.error("Script injection failed:", chrome.runtime.lastError.message);
                    document.getElementById("status").innerText = "Script injection failed. Please try again.";
                } else {
                    console.log("Scripts injected successfully:", results);
                    document.getElementById("status").innerText = "Results logged in console. Press F12 to view.";
                }
            }
        );
        document.getElementById("callApi").disabled = false;
        console.log("Script injected into tab ID:", tabId); 
    });
});