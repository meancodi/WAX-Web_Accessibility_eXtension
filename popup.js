document.getElementById("callApi").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        document.getElementById("callApi").disabled = true;
        document.getElementById("status").innerText = "Checking.....";
        const tabId = tabs[0].id;
        
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
                
                // First make sure the config is loaded fresh
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tabId, allFrames: false },
                        files: ["config.js"]
                    },
                    () => {
                        if (chrome.runtime.lastError) {
                            console.error("config.js injection failed:", chrome.runtime.lastError.message);
                            document.getElementById("status").innerText = "Config script injection failed. Please try again.";
                            document.getElementById("callApi").disabled = false;
                            return;
                        }
                        
                        // Now inject the content script that will use the config
                        chrome.scripting.executeScript(
                            {
                                target: { tabId: tabId, allFrames: false },
                                files: ["reportAndFix.js"]
                            },
                            (results) => {
                                if (chrome.runtime.lastError) {
                                    console.error("content.js injection failed:", chrome.runtime.lastError.message);
                                    document.getElementById("status").innerText = "Content script injection failed. Please try again.";
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
                files: ["axe.min.js", "report.js"]
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