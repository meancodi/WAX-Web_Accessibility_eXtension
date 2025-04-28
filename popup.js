document.getElementById("callApi").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        document.getElementById("callApi").disabled = true;
        document.getElementById("status").innerText = "Checking.....";
        const tabId = tabs[0].id;
        
        // First inject axe.min.js
        chrome.scripting.executeScript(
            {
                target: { tabId: tabId, allFrames: false },
                files: ["axe.min.js"]
            },
            () => {
                if (chrome.runtime.lastError) {
                    console.error("axe.min.js injection failed:", chrome.runtime.lastError.message);
                    if (chrome.runtime.lastError.message.includes("Cannot access a chrome:// URL")) {
                        document.getElementById("status").innerText = "Please open a non-chrome:// page to run the script.";
                    }else {
                        document.getElementById("status").innerText = "Script injection failed. Please try again.";
                    }
                    document.getElementById("callApi").disabled = false;
                    return;
                }
                
                // Then inject config.js
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tabId, allFrames: false },
                        files: ["config.js"]
                    },
                    () => {
                        if (chrome.runtime.lastError) {
                            console.error("config.js injection failed:", chrome.runtime.lastError.message);
                            document.getElementById("status").innerText = "Script injection failed. Please try again.";
                            document.getElementById("callApi").disabled = false;
                            return;
                        }
                        
                        // Finally inject content.js
                        chrome.scripting.executeScript(
                            {
                                target: { tabId: tabId, allFrames: false },
                                files: ["content.js"]
                            },
                            (results) => {
                                if (chrome.runtime.lastError) {
                                    console.error("content.js injection failed:", chrome.runtime.lastError.message);
                                    document.getElementById("status").innerText = "Script injection failed. Please try again.";
                                } else {
                                    console.log("All scripts injected successfully");
                                    document.getElementById("status").innerText = "Results logged in console. Press F12 to view.";
                                }
                                document.getElementById("callApi").disabled = false;
                            }
                        );
                    }
                );
            }
        );
    });
});

document.getElementById("getReport").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        document.getElementById("getReport").disabled = true;
        document.getElementById("status").innerText = "Checking.....";
        const tabId = tabs[0].id;
        
        chrome.scripting.executeScript(
            {
                target: { tabId: tabId, allFrames: false },
                files: ["axe.min.js", "contentwithoutfix.js"]
            },
            (results) => {
                if (chrome.runtime.lastError) {
                    console.error("Script injection failed:", chrome.runtime.lastError.message);
                    if (chrome.runtime.lastError.message.includes("Cannot access a chrome:// URL")) {
                        document.getElementById("status").innerText = "Please open a non-chrome:// page to run the script.";
                    }else {
                        document.getElementById("status").innerText = "Script injection failed. Please try again.";
                    }
                } else {
                    console.log("Scripts injected successfully");
                    document.getElementById("status").innerText = "Results logged in console. Press F12 to view.";
                }
                document.getElementById("getReport").disabled = false;
            }
        );
    });
});