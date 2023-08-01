const getAllIframeSrc = () => {
  const iframes = document.querySelectorAll("iframe");
  const iframeSrc = [];
  iframes.forEach((iframe) => {
    iframeSrc.push(iframe);
  });
  return iframeSrc;
};
const init = () => {
  console.log(getAllIframeSrc());
};

// init();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse(getAllIframeSrc());
});
