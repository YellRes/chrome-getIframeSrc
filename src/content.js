const MATCH_PRE_HTTP = [
  "http://101.37.228.6:88",
  "http://101.37.228.6:86",
  "http://101.37.228.6:96",
];

const getAllIframeSrc = () => {
  const liArr = document.querySelectorAll(".ma_taps > li");
  const matchedIframes = [...liArr].filter((liDom) =>
    MATCH_PRE_HTTP.some((matchItem) =>
      liDom.getAttribute("tab-id").startsWith(matchItem)
    )
  );

  return matchedIframes;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let infoArr = getAllIframeSrc().map((liDom) => {
    return {
      src: liDom.getAttribute("tab-id").replace(/^.*(?=\?)/, ""),
      name: liDom.querySelector("span").textContent,
    };
  });
  sendResponse(infoArr);
});
