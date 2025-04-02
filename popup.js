document.getElementById("callApi").addEventListener("click", () => {
  console.log("Button clicked!");
  chrome.tabs.query({currentWindow:true}, tabs =>{
    console.log("In popup tabs:",tabs);
    if (tabs.length === 0){
      console.log("No active tab found");
      return;
    }
    const activeTab = tabs.find(tab => tab.active);
    console.log("activeTab", activeTab.id);
  
    chrome.runtime.sendMessage({ action: "fetchData", activeTab : activeTab}, response => {
      console.log("Response from background.js", response);
      return true;
    });
    
  });
});