const getAllIframeSrc = () => {
  const iframes = document.querySelectorAll("iframe");
  const iframeSrc = [];
  iframes.forEach((iframe) => {
    iframeSrc.push(iframe.src);
  });
  return iframeSrc;
};
const init = () => {
  console.log(getAllIframeSrc());
};

init();

var port = chrome.runtime.connect();
window.addEventListener(
  "message",
  (event) => {
    // We only accept messages from ourselves
    if (event.source !== window) {
      return;
    }
    if (event.data.type && event.data.type === "FROM_PAGE") {
      console.log(port, "this port");
      //   port.postMessage(event.data.text, event.origin);
    }
  },
  false
);
