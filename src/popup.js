let handleEvent = () => {
  let refreshDom = document.querySelector("#refreshDom");

  refreshDom.addEventListener(
    "click",
    () => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTabId = tabs[0].id;
        chrome.scripting.executeScript(
          'document.querySelectorAll("iframe")',
          (result) => {
            const iframeCount = result;
            console.log(result);
          }
        );
      });
    },
    false
  );
};

document.addEventListener("DOMContentLoaded", handleEvent);
