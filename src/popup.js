let iframeArr = [];

let handleEvent = () => {
  let refreshDom = document.querySelector("#refreshDom");

  refreshDom.addEventListener(
    "click",
    () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTabId = tabs[0].id;
        // 当前tab发送事件
        chrome.tabs.sendMessage(currentTabId, "", (res) => {
          iframeArr = res;

          console.log(iframeArr, "iframeArr");
        });
      });
    },
    false
  );
};

document.addEventListener("DOMContentLoaded", handleEvent);
